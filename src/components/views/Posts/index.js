import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { withRouter } from 'react-router';
import firebase from '../../firebase.js';
import { AppContext } from '../../AppProvider';
import postsTreeFromRawPosts from '../../shared/postsTreeFromRawPosts';
import Spinner from '../../shared/Spinner';
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
import { isLurker, LURKER, NoLurking } from './Lurking';
import PremiumSaleCard from '../../shared/PremiumSaleCard';
import PremiumFeature from '../../shared/PremiumFeature';
import Mosaic from '../Community/Mosaic';

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

const PostsFeed = ({
  posts,
  isUnseenFeed = false,
  showHeaderLinkToParent = false,
  hackHideRepliesCount,
}) =>
  Object.entries(posts).map(([key, post]) => {
    return (
      <div className="mb-4" key={post.id}>
        <Post
          post={post}
          hackRoom={post.room}
          isUnseenFeed={isUnseenFeed}
          showHeaderLinkToParent={showHeaderLinkToParent}
          hackHideRepliesCount={hackHideRepliesCount}
        />
      </div>
    );
  });

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      lurkerStatus: null,
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
      callback: (lurkerStatus) => this.setState({ lurkerStatus }),
    });

    let postsRef = null;
    if (!this.user().isPremium) {
      postsRef = this.postsRef().orderByChild('room').equalTo('general');
    } else if (this.props.room.id === 'home') {
      postsRef = this.postsRef();
    } else if (this.props.room.id) {
      postsRef = this.postsRef()
        .orderByChild('room')
        .equalTo(this.props.room.id);
    }
    postsRef.on('value', (postsSnapshot) => {
      let posts = postsSnapshot.val();

      if (this.props.userFeedUid) {
        posts = Object.keys(posts)
          .filter((key) => posts[key].userId === this.props.userFeedUid)
          .reduce((res, key) => ((res[key] = posts[key]), res), {});
        this.setState({ feed: FEED.ALL });
      }

      this.setState({ posts, loading: false });
    });
  }

  render() {
    if (!this.user().isPremium && this.props.room.requiresPremium) {
      return <PremiumFeature featureName={'Premium rooms'} />;
    }

    const postId = this.props.match.params.postId;
    const isSinglePostPage = !!postId;

    const users = this.users();
    const { lurkerStatus } = this.state;
    // TODO fix this will spin erroneously for a room with legitimately 0 posts
    if (!users || this.state.loading || lurkerStatus === null) {
      return <Spinner />;
    }

    let feedSubtext = null;

    let post = {};
    let posts = [];
    if (
      lurkerStatus === LURKER.NO &&
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

    if (this.props.userFeedUid) {
      return (
        <PostsFeed
          posts={posts}
          showHeaderLinkToParent={true}
          hackHideRepliesCount={true}
        />
      );
    }

    return (
      <Row>
        <Col>
          {this.props.room.id && (
            <>
              <Card
                className="mb-3"
                style={{ backgroundColor: this.props.room.color || 'inherit' }}
              >
                <Card.Body>
                  <Card.Title>{this.props.room.title}</Card.Title>
                  {this.props.room.description}
                </Card.Body>
              </Card>
              {this.props.room.id === 'healthyrelating' && (
                <div className="mb-3">
                  <Mosaic
                    room={this.props.room.id}
                    size={48}
                    title={'Members'}
                  />
                </div>
              )}
            </>
          )}
          {!this.user().isPremium && <PremiumSaleCard />}
          <div className="notifications mb-3">
            <NotificationsFeed />
          </div>
        </Col>
        <Col sm={8} className="col-posts">
          {isSinglePostPage ? (
            lurkerStatus !== LURKER.NO ? (
              <NoLurking
                userDisplayName={this.user().displayName}
                lurkerStatus={lurkerStatus}
              />
            ) : (
              <Post
                post={post}
                hackIsSinglePostPage={isSinglePostPage}
                hackRoom={this.props.room.id}
                showHeaderLinkToParent={true}
              />
            )
          ) : (
            <>
              <NewTopLevelPostCard hackRoom={this.props.room.id} />
              {lurkerStatus !== LURKER.NO ? (
                <NoLurking
                  userDisplayName={this.user().displayName}
                  lurkerStatus={lurkerStatus}
                />
              ) : (
                <>
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
            </>
          )}
        </Col>
        <Col></Col>
      </Row>
    );
  }
}

export default withRouter(Posts);
