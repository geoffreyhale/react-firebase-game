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
import Post from './Post';
import {
  FEED,
  FeedNav,
  getFeedFilterByTags,
  getFeedPreference,
  getFollowingFeed,
  getHotFeed,
  getPopularFeed,
  getUnseenFeed,
} from './Feed';
import { PremiumFeature, PremiumSaleCard } from '../../shared/Premium';
import Mosaic from '../Community/Mosaic';
import Modality from '../../shared/Modalities';
import PostsFeed from '../../shared/PostsFeed';
import { NoLurkerBlock } from './Lurking';
import SearchFilter from './SearchFilter';

const userProfileUnhandledFeedsByTitle = ['following'];

const getPostsByTimestampObjectWithUserDataFromPostsArray = (
  flatPostsArray = [],
  users = {}
) => {
  const postsByTimestamp = {};
  flatPostsArray.forEach((post) => {
    if (users) {
      post.userDisplayName =
        (users[post.userId] && users[post.userId].displayName) || 'Loading...';
      post.userPhotoURL =
        (users[post.userId] && users[post.userId].photoURL) || null;
    }
    postsByTimestamp[post.timestamp] = post;
  });
  return postsByTimestamp;
};

const filterPosts = (posts = [], filter = '') => {
  let filteredPosts = posts;
  if (filter && filter !== '') {
    filteredPosts = posts.filter((post) => {
      return (
        (post.content && post.content.indexOf(filter) !== -1) ||
        (post.userDisplayName && post.userDisplayName.indexOf(filter) !== -1) ||
        (post.tags &&
          Object.values(post.tags).some(
            (tag) => tag.type.indexOf(filter) !== -1
          ))
      );
    });
  }
  return filteredPosts;
};

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

const filterPostsObject = (posts = {}, { uid }) =>
  Object.keys(posts)
    .filter((key) => posts[key].userId === uid)
    .reduce((res, key) => ((res[key] = posts[key]), res), {});

const getPosts = ({ roomId, userFeedUid, userIsPremium }, callback) => {
  const firebaseDatabaseRefPosts = firebase.database().ref('posts');

  let postsRef = null;
  if (!userIsPremium) {
    postsRef = firebaseDatabaseRefPosts.orderByChild('room').equalTo('general');
  } else if (userFeedUid || roomId === 'home') {
    postsRef = firebaseDatabaseRefPosts;
  } else if (roomId) {
    postsRef = firebaseDatabaseRefPosts.orderByChild('room').equalTo(roomId);
  }

  postsRef.on('value', (postsSnapshot) => {
    let posts = postsSnapshot.val();
    posts &&
      Object.entries(posts).forEach(([id, post]) => {
        posts[id] = { ...post, id };
      });
    callback(posts);
  });
};

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      posts: {},
      feed: '',
      postsFilter: {
        requiredTags: [],
        forbiddenTagsByMe: [],
      },
      searchFilterString: '',
    };
  }

  static contextType = AppContext;
  modality = () => this.context.modality;
  user = () => this.context.user;
  users = () => this.context.users;

  componentDidMount() {
    const { room, userFeedUid } = this.props;
    let feed = getFeedPreference() || FEED.HOT;
    getPosts(
      {
        roomId: room?.id,
        userFeedUid,
        userIsPremium: this.user().isPremium,
      },
      (posts) => {
        if (userFeedUid && userProfileUnhandledFeedsByTitle.includes(feed)) {
          // TODO this does not setFeedPreference for user, it's temporary, is okay/desirable?
          feed = FEED.RECENT;
        }
        if (this.props.match.params.postId && feed === FEED.ALL_ACTIVITY) {
          feed = FEED.RECENT;
        }
        this.setState({ feed, loading: false, posts });
      }
    );
  }

  render() {
    if (
      !this.user().isPremium &&
      this.props.room.requires &&
      this.props.room.requires.includes('premium')
    ) {
      return <PremiumFeature featureName={'Premium rooms'} />;
    }

    const postId = this.props.match.params.postId;
    const isSinglePostPage = !!postId;
    const users = this.users();
    let feedSubtext = null;
    let post = {};
    let postsTree = [];
    let displayIsolatedNonTree = false;

    if (!users || this.state.loading) {
      return <Spinner size="lg" />;
    }

    if (this.state.posts && this.state.posts.length !== 0) {
      const flatPostsArray = Object.values(this.state.posts);

      let filteredPostsArray = flatPostsArray;

      /**
       * Filter flat posts for feed
       */
      if (!isSinglePostPage) {
        if (this.state.feed === FEED.FILTER_BY_TAGS) {
          const { postsFilter } = this.state;
          [filteredPostsArray, feedSubtext] = getFeedFilterByTags({
            flatPostsArray,
            postsFilter,
            myUserId: this.user().uid,
          });
        }
      }

      /**
       * Filter flat posts for search filter
       */
      const filteredPosts = filterPosts(
        filteredPostsArray,
        this.state.searchFilterString
      );

      /**
       * All Activity feed does not use postTree
       */
      if (this.state.feed === FEED.ALL_ACTIVITY) {
        //TODO there is a lot of unnecessary switching from posts object to array to object to array
        const postsByTimestampObjectWithUserData = getPostsByTimestampObjectWithUserDataFromPostsArray(
          filteredPosts,
          users
        );
        postsTree = Object.values(postsByTimestampObjectWithUserData).sort(
          (a, b) => b.timestamp - a.timestamp
        );
        displayIsolatedNonTree = true;
        //TODO put this in Feed.js
        feedSubtext =
          'All posts and replies, chronologically, and isolated from thread trees';
      } else {
        /**
         * Build postsTree
         */
        postsTree = postsTreeFromRawPosts({
          flatPostsArray: filteredPosts,
          users,
        });

        if (isSinglePostPage) {
          /**
           * Find single post in postsTree
           */
          post = searchTree({ postId, post: { childNodes: postsTree } });
          if (!post) {
            post = null; // not found
          }
        } else {
          /**
           * Filter postsTree for feed
           */
          if (this.state.feed === FEED.FOLLOWING) {
            [postsTree, feedSubtext] = getFollowingFeed({
              posts: postsTree,
              userFollowingUids: this.user().following,
            });
          }
          if (this.state.feed === FEED.UNSEEN) {
            [postsTree, feedSubtext] = getUnseenFeed({
              flatPostsArray,
              posts: postsTree,
              userId: this.user().uid,
            });
          }
          if (this.state.feed === FEED.POPULAR) {
            [postsTree, feedSubtext] = getPopularFeed({ posts: postsTree });
          }
          if (this.state.feed === FEED.HOT) {
            [postsTree, feedSubtext] = getHotFeed({ posts: postsTree });
          }
        }
      }
    }

    /**
     * Render User Profile feed
     */
    if (this.props.userFeedUid) {
      const postsTreeForUserFeed = postsTree.filter(
        (post) => post.userId === this.props.userFeedUid
      );
      return (
        //TODO NoLurkerBlock text "You can use the form above to post." doesn't make sense in this context.
        <NoLurkerBlock>
          <div className="mb-2">
            <FeedNav
              userIsPremium={this.user().isPremium}
              hideFeedsByTitle={userProfileUnhandledFeedsByTitle}
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
          </div>
          <div className="mb-4">
            <SearchFilter
              doSearch={(value) => {
                this.setState({
                  searchFilterString: value,
                });
              }}
            />
          </div>
          <PostsFeed
            posts={postsTreeForUserFeed}
            showHeaderLinkToParent={displayIsolatedNonTree}
            hackHideRepliesCount={displayIsolatedNonTree}
          />
        </NoLurkerBlock>
      );
    }

    /**
     * Return
     */
    return (
      <Row>
        <Col className="col-left">
          {this.props.room.id && (
            <>
              <Card
                className="mb-3"
                style={{
                  backgroundColor: this.props.room.color || 'inherit',
                }}
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
              {/* !isSinglePostPage here is a hack, would be better to show applicable modality info */}
              {this.user().isPremium && this.modality() && !isSinglePostPage && (
                <div className="mb-3">
                  <Modality />
                </div>
              )}
            </>
          )}
          {!this.user().isPremium && <PremiumSaleCard />}
        </Col>
        <Col sm={8} className="col-main">
          {isSinglePostPage && (
            <Post
              //TODO parentPostAuthorUid
              post={post}
              hackIsSinglePostPage={isSinglePostPage}
              hackRoom={this.props.room.id}
              showHeaderLinkToParent={true}
            />
          )}
          {!isSinglePostPage && (
            <>
              <div className="mb-3">
                <NewTopLevelPostCard hackRoom={this.props.room.id} />
              </div>
              <NoLurkerBlock>
                <div className="mb-2">
                  <FeedNav
                    userIsPremium={this.user().isPremium}
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
                </div>
                <div className="mb-4">
                  <SearchFilter
                    doSearch={(value) => {
                      this.setState({
                        searchFilterString: value,
                      });
                    }}
                  />
                </div>
                <PostsFeed
                  posts={postsTree}
                  isUnseenFeed={this.state.feed === FEED.UNSEEN}
                  showHeaderLinkToParent={displayIsolatedNonTree}
                  hackHideRepliesCount={displayIsolatedNonTree}
                />
              </NoLurkerBlock>
            </>
          )}
        </Col>
      </Row>
    );
  }
}

export default withRouter(Posts);
