import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
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

const debounce = (func, timeout = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const SearchFilter = ({ value, setValue }) => (
  <InputGroup className="mb-3">
    <InputGroup.Prepend>
      <InputGroup.Text>
        <FontAwesomeIcon icon={faSearch} />
      </InputGroup.Text>
    </InputGroup.Prepend>
    <FormControl
      type="text"
      value={value}
      onChange={(e) => debounce(setValue(e.target.value))}
      placeholder={'post content must contain'}
    />
  </InputGroup>
);

const filterPosts = (posts = [], filter = '') => {
  let filteredPosts = posts;
  if (filter && filter !== '') {
    filteredPosts = posts.filter(
      (post) => post.content && post.content.indexOf(filter) !== -1
    );
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

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      posts: {},
      feed: FEED.HOT,
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

  db = () => firebase.database();
  postsRef = () => this.db().ref('posts');

  componentDidMount() {
    const feed = getFeedPreference();
    if (feed) {
      this.setState({ feed });
    }

    let postsRef = null;
    if (!this.user().isPremium) {
      postsRef = this.postsRef().orderByChild('room').equalTo('general');
    } else if (this.props.userFeedUid || this.props.room.id === 'home') {
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
    // TODO fix this will spin erroneously for a room with legitimately 0 posts
    if (!users || this.state.loading) {
      return <Spinner size="lg" />;
    }

    let feedSubtext = null;

    let post = {};
    let posts = [];
    if (this.state.posts && this.state.posts.length !== 0) {
      const flatPostsArray = Object.entries(this.state.posts).map(
        ([id, post]) => {
          post.id = id;
          return post;
        }
      );

      let filteredPostsArray = flatPostsArray;
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

      const postsTree = postsTreeFromRawPosts({
        flatPostsArray: filterPosts(
          filteredPostsArray,
          this.state.searchFilterString
        ),
        users,
      });
      posts = postsTree.posts;

      if (isSinglePostPage) {
        post = searchTree({ postId, post: { childNodes: postsTree.posts } });
        if (!post) {
          post = null; // not found
        }
      } else {
        if (this.state.feed === FEED.FOLLOWING) {
          [posts, feedSubtext] = getFollowingFeed({
            posts,
            userFollowingUids: this.user().following,
          });
        }
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
        <Col className="col-left">
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
              post={post}
              hackIsSinglePostPage={isSinglePostPage}
              hackRoom={this.props.room.id}
              showHeaderLinkToParent={true}
            />
          )}
          {!isSinglePostPage && (
            <>
              <NewTopLevelPostCard hackRoom={this.props.room.id} />
              <NoLurkerBlock>
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
                <div className="mb-2">
                  <SearchFilter
                    value={this.state.searchFilterString}
                    setValue={(value) => {
                      this.setState({
                        searchFilterString: value,
                      });
                    }}
                  />
                </div>
                <PostsFeed
                  posts={posts}
                  isUnseenFeed={this.state.feed === FEED.UNSEEN}
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
