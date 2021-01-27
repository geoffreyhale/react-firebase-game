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
import { RoomsMenu } from '../Rooms';
import { isLurker, NoLurking } from './Lurking';

import './index.css';

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

const PostsFeed = ({ posts, isUnseenFeed = false }) => (
  <table>
    <tbody>
      {Object.entries(posts).map(([key, post]) => {
        return (
          <tr key={post.id}>
            <td>
              <Card className="mt-4">
                <Card.Body>
                  <Post post={post} hackRoom={post.room} />
                </Card.Body>
                {isUnseenFeed ? (
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
);

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      lurker: null,
      posts: {},
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
    const userId = this.user().uid;
    isLurker({
      userId,
      callback: (isLurker) => this.setState({ lurker: isLurker }),
    });

    let postsRef = null;
    if (this.props.room) {
      postsRef = this.postsRef().orderByChild('room').equalTo(this.props.room);
    } else {
      postsRef = this.postsRef();
    }
    postsRef.on('value', (postsSnapshot) => {
      let posts = postsSnapshot.val();

      if (this.props.uid) {
        posts = Object.keys(posts)
          .filter((key) => posts[key].userId === this.props.uid)
          .reduce((res, key) => ((res[key] = posts[key]), res), {});
        this.setState({ feed: FEED.ALL });
      }

      this.setState({ posts, loading: false });
    });
  }

  render() {
    const hackIsUserFeed = this.props.uid;
    const hackOnlyShowThePostsColumn = hackIsUserFeed;

    const postId = this.props.match.params.postId;
    const isSinglePostPage = !!postId;

    const users = this.users();
    // TODO fix this will spin erroneously for a room with legitimately 0 posts
    if (!users || this.state.loading || this.state.lurker === null) {
      return <Spinner />;
    }

    let feedSubtext = null;

    let post = {};
    let posts = [];
    if (
      !this.state.lurker &&
      this.state.posts &&
      this.state.posts.length !== 0
    ) {
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
      posts = postsTree.posts;

      if (isSinglePostPage) {
        post = searchTree({ postId, post: { childNodes: postsTree.posts } });
        if (!post) {
          post = null; // not found
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
    }

    if (hackOnlyShowThePostsColumn) {
      // TODO these display without any context
      // ie replies display without links to higher level posts
      // at least just add link headers to the replyToId post single post page
      return <PostsFeed posts={posts} />;
    }

    return (
      <Row>
        <Col>
          {this.props.room && (
            <Card
              className="mb-3"
              style={{ backgroundColor: this.props.roomColor || 'inherit' }}
            >
              <Card.Body>
                <Card.Title>r/{this.props.room}</Card.Title>
                {this.props.roomDescription}
              </Card.Body>
            </Card>
          )}
          <div className="mb-3">
            <RoomsMenu />
          </div>
          <div className="notifications mb-3">
            <NotificationsFeed />
          </div>
        </Col>
        <Col sm={8} className="col-posts">
          {this.state.lurker ? (
            <>
              {this.props.room && (
                <NewTopLevelPostCard hackRoom={this.props.room} />
              )}
              <NoLurking userDisplayName={this.user().displayName} />
            </>
          ) : isSinglePostPage ? (
            <Card>
              {post ? (
                <>
                  <Card.Header>
                    {post.replyToId ? (
                      <Link
                        to={`/r/${this.props.room}/posts/${post.replyToId}`}
                      >
                        &#8598;...
                      </Link>
                    ) : null}
                  </Card.Header>
                  <Card.Body>
                    <Post
                      post={post}
                      myPhotoURL={this.user().photoURL}
                      hackHidePostLinks={true} // TODO current routing appends extra '/post''s
                      hackRoom={post.room} // TODO use context instead?
                      hackIsSinglePostPage={isSinglePostPage}
                    />
                  </Card.Body>
                </>
              ) : (
                <Card.Body>Post not found!</Card.Body>
              )}
            </Card>
          ) : (
            <>
              {this.props.room && (
                <NewTopLevelPostCard hackRoom={this.props.room} />
              )}

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
                feedSubtext={feedSubtext}
              />

              <PostsFeed
                posts={posts}
                isUnseenFeed={this.state.feed === FEED.UNSEEN}
              />
            </>
          )}
        </Col>
        <Col></Col>
      </Row>
    );
  }
}

export default withRouter(Posts);
