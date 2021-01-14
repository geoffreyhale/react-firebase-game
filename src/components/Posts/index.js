import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import firebase from '../../firebase.js';
import { AppContext } from '../AppProvider';
import Mosaic from './Mosaic';
import Post from './Post';
import postsTreeFromRawPosts from './postsTreeFromRawPosts';
import Stats from './Stats';
import Tag from './Tag';
import MarkAsSeenButton from './MarkAsSeenButton';
import NewTopLevelPostCard from './NewTopLevelPostCard';

const PostsNav = ({ currentFeed, setFeed, setPostsFilter }) => (
  <Nav className="justify-content-center">
    <Nav.Item>
      <Nav.Link
        active={currentFeed === 'unseen'}
        onClick={() => {
          setFeed('unseen');
          setPostsFilter([], []);
        }}
      >
        Unseen
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link
        active={currentFeed === 'smart'}
        onClick={() => {
          setFeed('smart');
          setPostsFilter([], []);
        }}
      >
        Smart Feed
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link
        active={currentFeed === 'all'}
        onClick={() => {
          setFeed('all');
          setPostsFilter([], []);
        }}
      >
        All Posts
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link
        active={currentFeed === 'postsFilterByTags'}
        onClick={() => {
          setFeed('postsFilterByTags');
          setPostsFilter(['feature request'], ['done']);
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
      countLowPriorityPosts: 0,
      feed: 'unseen',
      users: {},
      postsFilter: {
        requiredTags: [],
        forbiddenTagsByMe: [],
      },
    };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  db = () => firebase.database();
  postsRef = () => this.db().ref('posts');

  componentDidMount() {
    const usersRef = firebase.database().ref('users');
    usersRef.once('value', (usersSnapshot) => {
      this.setState({ users: usersSnapshot.val() });

      this.postsRef().on('value', (postsSnapshot) => {
        const posts = postsSnapshot.val();
        this.setState({ rawPosts: posts });
      });
    });
  }

  render() {
    let feedSubtext = null;

    const flatPostsArray = Object.entries(this.state.rawPosts).map(
      ([id, post]) => {
        post.id = id;
        return post;
      }
    );

    let filteredPosts = flatPostsArray;
    switch (this.state.feed) {
      case 'postsFilterByTags':
        const { postsFilter } = this.state;
        // TODO tests for this
        filteredPosts = flatPostsArray
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
                      (tag) =>
                        tag.type === forbiddenTag &&
                        tag.userId === this.user().uid
                    );
                  }
                );
                return hasTagsRequiredByFilter && !hasForbiddenTagsByMe;
              }
              return false;
            })
          : null;
        feedSubtext = (
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
              {postsFilter.forbiddenTagsByMe.map((forbiddenTagByMe) => (
                <Tag variant="info">{forbiddenTagByMe}</Tag>
              ))}
            </div>
            'Posts tagged `feature request` that viewer did not tag `done` (for
            dev use):'
          </>
        );
        break;
    }

    const postsTree = postsTreeFromRawPosts({
      flatPostsArray: filteredPosts,
      users: this.state.users,
    });
    let posts = postsTree.posts;
    const countLowPriorityPosts = postsTree.data.countLowPriorityPosts;

    if (this.state.feed === 'unseen') {
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
        'Threads in which someone else posted since you last clicked the yellow `mark thread as seen` button.  Click the `mark thread as seen` button to temporarily hide a thread from this feed until someone else posts something new.';
    }

    return (
      <Row>
        <Col>
          <Mosaic />
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
                if (this.state.feed === 'smart' && post.lowPriority) {
                  return null;
                }

                return (
                  <tr key={post.id + post.childNodes.length}>
                    <td>
                      <Card className="mt-4">
                        <Card.Body>
                          {/* <SmartPost
                            postId={post.id}
                            hackForPostChildNodes={post.childNodes}
                          /> */}
                          <Post post={post} />
                        </Card.Body>
                        {this.state.feed === 'unseen' ? (
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
              {this.state.feed === 'smart' ? (
                <tr key={'countLowPriorityPosts'}>
                  <td>
                    <Card className="mt-2">
                      <Card.Body>
                        {countLowPriorityPosts} posts were hidden because they
                        were determined to be old.
                      </Card.Body>
                    </Card>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </Col>
        <Col>
          <Stats posts={this.state.rawPosts} users={this.state.users} />
        </Col>
      </Row>
    );
  }
}
