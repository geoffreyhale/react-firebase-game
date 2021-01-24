import React, { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import { AppContext } from '../AppProvider';
import Tag from '../shared/Tag';

export const FEED = Object.freeze({
  ALL: 'all',
  FILTER_BY_TAGS: 'postsFilterByTags',
  HOT: 'hot',
  POPULAR: 'popular',
  UNSEEN: 'unseen',
});

// TODO write tests for this
export const getPopularFeed = ({ posts }) => [
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
  flatPostsArray,
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

export const FeedNav = ({ currentFeed, setFeed, setPostsFilter }) => {
  const { user } = useContext(AppContext);
  return (
    <Nav variant="tabs" className="justify-content-center mt-2">
      <Nav.Item>
        <Nav.Link
          active={currentFeed === FEED.HOT}
          onClick={() => {
            setFeed(FEED.HOT);
            setPostsFilter([], []);
          }}
        >
          Hot
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          active={currentFeed === FEED.POPULAR}
          onClick={() => {
            setFeed(FEED.POPULAR);
            setPostsFilter([], []);
          }}
        >
          Upvotes
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          active={currentFeed === FEED.UNSEEN}
          onClick={() => {
            setFeed(FEED.UNSEEN);
            setPostsFilter([], []);
          }}
        >
          Unseen
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          active={currentFeed === FEED.ALL}
          onClick={() => {
            setFeed(FEED.ALL);
            setPostsFilter([], []);
          }}
        >
          All
        </Nav.Link>
      </Nav.Item>
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
  );
};
