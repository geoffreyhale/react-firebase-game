import React, { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import { AppContext } from '../../AppProvider';
import Tag from '../../shared/Tag';
import { elapsedDuration } from '../../shared/timestamp';

const setFeedPreference = (feed) => {
  window.localStorage.setItem('feed', feed);
};
export const getFeedPreference = () => window.localStorage.getItem('feed');

export const FEED = Object.freeze({
  RECENT: 'recent',
  FILTER_BY_TAGS: 'postsFilterByTags',
  HOT: 'hot',
  POPULAR: 'popular',
  UNSEEN: 'unseen',
  FOLLOWING: 'following',
});

export const getFollowingFeed = ({ posts, userFollowingUids }) => {
  return [
    posts.filter(
      (post) => userFollowingUids && userFollowingUids.includes(post.userId)
    ),
    'All recent posts from only users you follow',
  ];
};

export const hotScore = ({ post }) => {
  if (
    (post.upvote === undefined && post.childNodes === undefined) ||
    post.timestamp === undefined
  ) {
    return 0;
  }

  const upvotes = post.upvote ? Object.keys(post.upvote).length : 0;
  const firstChildren = post.childNodes ? post.childNodes.length : 0;
  const upvotesPlusFirstChildren = upvotes + firstChildren / 2 + 1; // + 1 avoids exceptional 0 case

  const { timestamp } = post;
  const t = elapsedDuration({ timestamp });
  // more than 1 month old
  if (t.years || t.months) {
    return upvotesPlusFirstChildren;
  }
  // 1 month - 1 wk
  if (t.days >= 7) {
    return upvotesPlusFirstChildren * 10;
  }
  // 1 wk - 1 day
  if (t.days) {
    return upvotesPlusFirstChildren * 100;
  }
  // 1 day - 1 hour
  if (t.hours) {
    return upvotesPlusFirstChildren * 1000;
  }
  // 1 hour - 1 minute
  if (t.minutes) {
    return upvotesPlusFirstChildren * 10000;
  }
  // less than 1 minute
  return upvotesPlusFirstChildren * 100000;
};
/**
 * sorts posts by feedHot score greatest to least
 */
// TODO fix this mutates posts, undesirable
export const getHotFeed = ({ posts }) => {
  Object.keys(posts).forEach((key) => {
    posts[key].feedHot = hotScore({ post: posts[key] });
  });

  posts.sort((a, b) => {
    if (!a.feedHot) return 1;
    if (!b.feedHot) return -1;
    return b.feedHot - a.feedHot;
  });
  posts.forEach((post, i) => {
    delete posts[i].feedHot;
  });
  return [posts, 'Upvotes and recency (upvotes / days old)'];
};

// TODO write tests for this
export const getPopularFeed = ({ posts }) => [
  // TODO fix this mutates posts, undesirable
  posts.sort((a, b) => {
    if (!a.upvote) return 1;
    if (!b.upvote) return -1;
    return (
      (b.upvote && Object.keys(b.upvote).length) -
      (a.upvote && Object.keys(a.upvote).length)
    );
  }),
  'Most upvotes',
];

// TODO write tests for this
export const getFeedFilterByTags = ({
  flatPostsArray = [],
  postsFilter,
  myUserId,
}) => {
  const filteredPosts = flatPostsArray
    ? flatPostsArray.filter((post) => {
        const hasTags = !!post.tags;
        if (hasTags) {
          const hasTagsRequiredByFilter = postsFilter.requiredTags.every(
            (requiredTag) => {
              return Object.values(post.tags).some(
                (tag) => tag.type === requiredTag
              );
            }
          );
          const hasForbiddenTagsByMe = postsFilter.forbiddenTagsByMe.some(
            (forbiddenTag) => {
              return Object.values(post.tags).some(
                (tag) => tag.type === forbiddenTag && tag.userId === myUserId
              );
            }
          );
          return hasTagsRequiredByFilter && !hasForbiddenTagsByMe;
        }
        return false;
      })
    : null;
  const feedSubtext = (
    <>
      <div>Pre-programmed Tag Filter:</div>
      <div>
        Required:{' '}
        {postsFilter.requiredTags.map((requiredTag) => (
          <>
            <Tag>{requiredTag}</Tag>
            {' or '}
            <Tag variant="info">{requiredTag}</Tag>
          </>
        ))}
      </div>
      <div>
        Forbidden:{' '}
        {postsFilter.forbiddenTagsByMe.map((forbiddenTagByMe, i) => (
          <>
            {i !== 0 ? ' or ' : ''}
            <Tag variant="info">{forbiddenTagByMe}</Tag>
          </>
        ))}
      </div>
      'Posts tagged `feature request` that viewer did not tag `done` or `closed`
      (for dev use):'
    </>
  );
  return [filteredPosts, feedSubtext];
};

export const getUnseenFeed = ({ flatPostsArray, posts, userId }) => {
  // TODO write tests for this
  const threadSeedPostIdsToAllow =
    flatPostsArray &&
    flatPostsArray
      .filter((post) => {
        let mostRecentPostInThread = post;
        let topLevelPostOrMostRecentPostBySomeoneElse = post;
        flatPostsArray.forEach((p) => {
          const isReplyToThisPost = p.replyToId && p.replyToId === post.id;
          if (isReplyToThisPost) {
            if (
              !mostRecentPostInThread ||
              p.timestamp > mostRecentPostInThread.timestamp
            ) {
              mostRecentPostInThread = p;
              if (p.userId !== userId) {
                topLevelPostOrMostRecentPostBySomeoneElse = p;
              }
            }
          }
        });

        const yourMarkAsSeenTimestamp = post.seen && post.seen[userId];
        const yourMarkAsSeenTimestampIsMoreRecentThanMostRecentPostBySomeoneElseInThread = topLevelPostOrMostRecentPostBySomeoneElse
          ? yourMarkAsSeenTimestamp >
            topLevelPostOrMostRecentPostBySomeoneElse.timestamp
          : true;

        return !yourMarkAsSeenTimestampIsMoreRecentThanMostRecentPostBySomeoneElseInThread;
      })
      .map((post) => post.id);

  // TODO fix this mutates posts, undesirable
  posts = posts.filter((post) => threadSeedPostIdsToAllow.includes(post.id));

  return [
    posts,
    'Threads in which someone else posted since you last clicked the yellow `seen` button.  Click the `seen` button to temporarily hide a thread from this feed until someone else posts something new.',
  ];
};

export const FeedNav = ({
  currentFeed,
  setFeed,
  setPostsFilter,
  feedSubtext,
  hideFeedsByTitle = [],
}) => {
  const { user } = useContext(AppContext);
  const navItemData = [
    {
      title: 'Hot',
      feed: FEED.HOT,
    },
    {
      title: 'Following',
      feed: FEED.FOLLOWING,
    },
    {
      title: 'Recent',
      feed: FEED.RECENT,
    },
    {
      title: 'Upvotes',
      feed: FEED.POPULAR,
    },
    {
      title: 'Unseen',
      feed: FEED.UNSEEN,
    },
  ];
  const re = new RegExp(hideFeedsByTitle.join('|'), 'i');
  return (
    <>
      <Nav variant="tabs" className="justify-content-center">
        {navItemData
          .filter(
            (item) => hideFeedsByTitle.length === 0 || !re.test(item.title)
          )
          .map((item) => (
            <Nav.Item key={item.title}>
              <Nav.Link
                active={currentFeed === item.feed}
                onClick={() => {
                  setFeed(item.feed);
                  setPostsFilter(item.filters);
                  setFeedPreference(item.feed);
                }}
              >
                {item.title}
              </Nav.Link>
            </Nav.Item>
          ))}
        {user.admin && (
          <Nav.Item>
            <Nav.Link
              active={currentFeed === FEED.FILTER_BY_TAGS}
              onClick={() => {
                setFeed(FEED.FILTER_BY_TAGS);
                setPostsFilter(['feature request'], ['done', 'closed']);
              }}
            >
              Feature Requests
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>

      {feedSubtext ? <small className="text-muted">{feedSubtext}</small> : null}
    </>
  );
};
