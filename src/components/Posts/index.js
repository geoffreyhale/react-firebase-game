import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import firebase from '../firebase.js';
import { AppContext } from '../AppProvider';
import postsTreeFromRawPosts from '../shared/postsTreeFromRawPosts';
import Spinner from '../shared/Spinner';
import MarkAsSeenButton from './MarkAsSeenButton';
import NewTopLevelPostCard from './NewTopLevelPostCard';
import NotificationsFeed from './NotificationsFeed';
import Post from './Post';
import {
  FEED,
  FeedNav,
  getFeedFilterByTags,
  getHotFeed,
  getPopularFeed,
  getUnseenFeed,
} from './Feed';

const searchTree = ({ postId, post, key = 'childNodes' }) => {
  if (post.id === postId) {
    return post;
  } else if (post[key]) {
    var i;
    var result = null;
    for (i = 0; result == null && i < post[key].length; i++) {
      result = searchTree({ postId, post: post[key][i] });
    }
    return result;
  }
  return null;
};

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      rawPosts: {},
      feed: FEED.HOT,
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
      this.setState({ posts });
    });
  }

  render() {
    const postId = this.props.match.params.postId;
    const isSinglePostPage = !!postId;

    const users = this.users();
    if (!users || !this.state.posts || this.state.posts.length === 0) {
      return <Spinner />;
    }

    let feedSubtext = null;

    const flatPostsArray = Object.entries(this.state.posts).map(
      ([id, post]) => {
        post.id = id;
        return post;
      }
    );

    let filteredPosts = flatPostsArray;
    if (!isSinglePostPage) {
      if (this.state.feed === FEED.FILTER_BY_TAGS) {
        const { postsFilter } = this.state;
        [filteredPosts, feedSubtext] = getFeedFilterByTags({
          flatPostsArray,
          postsFilter,
          myUserId: this.user().uid,
        });
      }
    }

    const postsTree = postsTreeFromRawPosts({
      flatPostsArray: filteredPosts,
      users,
    });
    let { posts } = postsTree;

    let post = {};
    if (isSinglePostPage) {
      post = searchTree({ postId, post: { childNodes: postsTree.posts } });
      if (!post) {
        return <>Post not found!</>;
      }
    } else {
      if (this.state.feed === FEED.UNSEEN) {
        [posts, feedSubtext] = getUnseenFeed({
          flatPostsArray,
          posts,
          userId: this.user().uid,
        });
      }
      if (this.state.feed === FEED.POPULAR) {
        [posts, feedSubtext] = getPopularFeed({ posts });
      }
      if (this.state.feed === FEED.HOT) {
        [posts, feedSubtext] = getHotFeed({ posts });
      }
    }

    return (
      <Row>
        <Col>
          <NotificationsFeed />
        </Col>
        <Col sm={8} className="col-posts mt-3">
          {isSinglePostPage ? (
            <Card>
              <Card.Header>
                {post.replyToId ? (
                  <Link to={'/posts/' + post.replyToId}>&#8598;...</Link>
                ) : null}
              </Card.Header>
              <Card.Body>
                <Post
                  post={post}
                  myPhotoURL={this.user().photoURL}
                  hackHidePostLinks={true} // TODO current routing appends extra '/post''s
                />
              </Card.Body>
            </Card>
          ) : (
            <>
              <NewTopLevelPostCard />

              <FeedNav
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
                      <tr key={post.id}>
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
            </>
          )}
        </Col>
        <Col></Col>
      </Row>
    );
  }
}

export default withRouter(Posts);
