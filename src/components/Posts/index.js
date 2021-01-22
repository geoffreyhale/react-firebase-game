import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import firebase from '../../firebase.js';
import { AppContext } from '../AppProvider';
import postsTreeFromRawPosts from '../shared/postsTreeFromRawPosts';
import Spinner from '../shared/Spinner';
import Tag from '../shared/Tag';
import MarkAsSeenButton from './MarkAsSeenButton';
import NewTopLevelPostCard from './NewTopLevelPostCard';
import NotificationsFeed from './NotificationsFeed';
import Post from './Post';

const FEED = Object.freeze({
  UNSEEN: 'unseen',
  ALL: 'all',
  FILTER_BY_TAGS: 'postsFilterByTags',
  POPULAR: 'popular',
});

// TODO tests for this
const getFeedFilterByTags = ({ flatPostsArray, postsFilter, myUserId }) => {
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

const PostsNav = ({ currentFeed, setFeed, setPostsFilter }) => (
  <Nav className="justify-content-center">
    <Nav.Item>
      <Nav.Link
        active={currentFeed === FEED.POPULAR}
        onClick={() => {
          setFeed(FEED.POPULAR);
          setPostsFilter([], []);
        }}
      >
        Popular
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
        All Posts
      </Nav.Link>
    </Nav.Item>
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
  </Nav>
);

export default class Posts extends Component {
  constructor() {
    super();
    this.state = {
      rawPosts: {},
      feed: FEED.UNSEEN,
      postsFilter: {
        requiredTags: [],
        forbiddenTagsByMe: [],
      },
    };
  }

  static contextType = AppContext;
  user = () => this.context.user;
  users = () => this.context.users;
  db = () => firebase.database();
  postsRef = () => this.db().ref('posts');

  componentDidMount() {
    this.postsRef().on('value', (postsSnapshot) => {
      const posts = postsSnapshot.val();
      this.setState({ rawPosts: posts });
    });
  }

  render() {
    const users = this.users();
    if (!users) {
      <Spinner />;
    }

    let feedSubtext = null;

    const flatPostsArray = Object.entries(this.state.rawPosts).map(
      ([id, post]) => {
        post.id = id;
        return post;
      }
    );

    let filteredPosts = flatPostsArray;
    if (this.state.feed === FEED.FILTER_BY_TAGS) {
      const { postsFilter } = this.state;
      [filteredPosts, feedSubtext] = getFeedFilterByTags({
        flatPostsArray,
        postsFilter,
        myUserId: this.user().uid,
      });
    }

    const postsTree = postsTreeFromRawPosts({
      flatPostsArray: filteredPosts,
      users,
    });
    let { posts } = postsTree;

    if (this.state.feed === FEED.UNSEEN) {
      // TODO tests for this
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
                  if (p.userId !== this.user().uid) {
                    topLevelPostOrMostRecentPostBySomeoneElse = p;
                  }
                }
              }
            });

            const yourMarkAsSeenTimestamp =
              post.seen && post.seen[this.user().uid];
            const yourMarkAsSeenTimestampIsMoreRecentThanMostRecentPostBySomeoneElseInThread = topLevelPostOrMostRecentPostBySomeoneElse
              ? yourMarkAsSeenTimestamp >
                topLevelPostOrMostRecentPostBySomeoneElse.timestamp
              : true;

            return !yourMarkAsSeenTimestampIsMoreRecentThanMostRecentPostBySomeoneElseInThread;
          })
          .map((post) => post.id);

      posts = posts.filter((post) =>
        threadSeedPostIdsToAllow.includes(post.id)
      );
      feedSubtext =
        'Threads in which someone else posted since you last clicked the yellow `seen` button.  Click the `seen` button to temporarily hide a thread from this feed until someone else posts something new.';
    }

    if (this.state.feed === FEED.POPULAR) {
      posts.sort((a, b) => {
        if (!a.upvote) return 1;
        if (!b.upvote) return -1;
        return (
          (b.upvote && Object.keys(b.upvote).length) -
          (a.upvote && Object.keys(a.upvote).length)
        );
      });
      feedSubtext = 'Most upvotes';
    }

    return (
      <Row>
        <Col>
          <NotificationsFeed />
        </Col>
        <Col sm={8} className="col-posts mt-3">
          <NewTopLevelPostCard />

          <PostsNav
            currentFeed={this.state.feed}
            setFeed={(feed) => this.setState({ feed: feed })}
            setPostsFilter={(requiredTags, forbiddenTagsByMe) =>
              this.setState({
                postsFilter: {
                  requiredTags: requiredTags,
                  forbiddenTagsByMe: forbiddenTagsByMe,
                },
              })
            }
          />

          {feedSubtext ? (
            <small className="text-muted">{feedSubtext}</small>
          ) : null}

          <table>
            <tbody>
              {Object.entries(posts).map(([key, post]) => {
                return (
                  <tr key={post.id + post.childNodes.length}>
                    <td>
                      <Card className="mt-4">
                        <Card.Body>
                          <Post post={post} />
                        </Card.Body>
                        {this.state.feed === FEED.UNSEEN ? (
                          <Card.Footer>
                            <div className="float-right">
                              <MarkAsSeenButton postId={post.id} />
                            </div>
                            <div style={{ clear: 'both' }}></div>
                          </Card.Footer>
                        ) : null}
                      </Card>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Col>
        <Col></Col>
      </Row>
    );
  }
}
