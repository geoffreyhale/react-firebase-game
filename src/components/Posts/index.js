import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import firebase, { auth } from '../../firebase.js';
import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';
import MyDropdownToggle from '../shared/MyDropdownToggle';
import Stats from './Stats';
import postsTreeFromRawPosts from './postsTreeFromRawPosts';
import Mosaic from './mosaic';
import NewPostForm from './NewPostForm';
import PostTags from './PostTags';

//TODO write tests for this function
const friendlyTimestamp = (timestamp) => {
  const timestampDate = new Date(timestamp);
  const formattedTimestamp = format(timestampDate, "MMMM d, yyyy 'at' hh:mm b");
  const duration = intervalToDuration({
    start: timestampDate,
    end: new Date(),
  });
  if (duration.years || duration.months || duration.days > 3) {
    return `${formattedTimestamp}`;
  }
  if (duration.days) {
    return `${duration.days}d`;
  }
  if (duration.hours) {
    return `${duration.hours}h`;
  }
  if (duration.minutes) {
    return `${duration.minutes}m`;
  }
  if (duration.seconds) {
    return `${duration.seconds}s`;
  }
  return `${formattedTimestamp} (${formatDuration(duration)})`;
};

const PostActionsDropdown = ({ deletePost }) => (
  <Dropdown>
    <MyDropdownToggle />
    <Dropdown.Menu>
      <Dropdown.Item as="button" onClick={deletePost}>
        Delete
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

const PostHeader = ({
  displayName,
  showActions,
  postActionsDropdown,
  timestamp,
  photoURL,
  small,
  postId,
}) => (
  <div style={{ fontSize: small ? '85%' : null }}>
    <div className="float-left mr-2">
      {photoURL ? (
        <img src={photoURL} alt="user" style={{ height: small ? 38 : 48 }} />
      ) : null}
    </div>
    <>
      <div>
        <strong>{displayName}</strong>
        <div className="float-right">
          {showActions ? postActionsDropdown : null}
        </div>
      </div>
      <div className="small text-muted">
        <Link to={'post/' + postId}>{friendlyTimestamp(timestamp)}</Link>
      </div>
    </>
    <div style={{ clear: 'both' }}></div>
  </div>
);

const PostContent = ({ children, small }) => (
  <div
    className="mt-1"
    style={{ whiteSpace: 'break-spaces', fontSize: small ? '85%' : null }}
  >
    {children}
  </div>
);

const NewPostCard = ({ photoURL, displayName, createNewPost }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {photoURL ? (
            <img src={photoURL} alt="user" style={{ height: 48 }} />
          ) : null}
          {displayName}
          <small className="text-muted ml-2">&#127757; Public</small>
        </Card.Title>
        <NewPostForm onSubmit={createNewPost} multiline={true} />
      </Card.Body>
    </Card>
  );
};

const ReplyPostCard = ({
  userDisplayName,
  showActions,
  postActionsDropdown,
  timestamp,
  userPhotoURL,
  content,
  postTags,
  myUserId,
  thisPostId,
  addTag,
}) => {
  return (
    <Card className="mt-1">
      <Card.Body style={{ padding: '0.75rem' }}>
        <PostHeader
          displayName={userDisplayName}
          showActions={showActions}
          postActionsDropdown={postActionsDropdown}
          timestamp={timestamp}
          photoURL={userPhotoURL}
          small={true}
          postId={thisPostId}
        />
        <PostContent>{content}</PostContent>
        <div className="mt-2">
          <PostTags
            tags={postTags}
            myUserId={myUserId}
            addTag={(content, successCallback) =>
              addTag(thisPostId, content, successCallback, myUserId)
            }
            postId={thisPostId}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

const ReplyForm = ({ userPhotoURL, createNewPost, replyToPostId }) => {
  return (
    <div
      className="mt-3"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div className={'mr-2'} style={{ alignSelf: 'flex-start' }}>
        {userPhotoURL ? (
          <img src={userPhotoURL} alt="user" style={{ height: 38 }} />
        ) : null}
      </div>
      <div style={{ flexGrow: 1 }}>
        <NewPostForm
          onSubmit={createNewPost}
          placeholder="Write a reply..."
          hideSubmitButton={true}
          replyToId={replyToPostId}
        />
      </div>
    </div>
  );
};

export default class Posts extends Component {
  constructor() {
    super();
    this.state = {
      rawPosts: {},
      countLowPriorityPosts: 0,
      feed: 'smart',
      users: {},
    };
    this.createNewPost = this.createNewPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const postsRef = firebase.database().ref('posts');
        postsRef.on('value', (snapshot) => {
          this.setState({ rawPosts: snapshot.val() });
          const usersRef = firebase.database().ref('users');
          usersRef.once('value', (usersSnapshot) => {
            this.setState({ users: usersSnapshot.val() });
          });
        });
      }
    });
  }
  createNewPost(newPostContent, replyToId, successCallback) {
    const uid = this.props.user && this.props.user.uid;
    const postsRef = firebase.database().ref('posts');
    const key = postsRef.push().key;
    postsRef
      .child(key)
      .update({
        content: newPostContent,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId: uid,
        replyToId: replyToId,
      })
      .then(successCallback());
  }
  deletePost(statePostsKey) {
    const post = this.state.rawPosts[statePostsKey];
    const postsRef = firebase.database().ref('posts');
    postsRef.child(post.id).remove();
  }
  addTag(postId, tagContent, successCallback, myUserId) {
    const uid = myUserId; // TODO is this safe to do?
    const postRef = firebase.database().ref('posts/' + postId);
    const key = postRef.child('tags').push().key;
    postRef
      .child('tags')
      .child(key)
      .update({
        type: tagContent,
        userId: uid,
      })
      .then(successCallback());
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
      case 'feature request':
        // TODO tests for this
        filteredPosts = flatPostsArray
          ? flatPostsArray.filter((post) => {
              return (
                post.tags &&
                Object.values(post.tags).some(
                  (tag) => tag.type === 'feature request'
                ) &&
                Object.values(post.tags).every(
                  (tag) =>
                    tag.type !== 'done' || tag.userId !== this.props.user.uid
                )
              );
            })
          : null;
        break;
    }

    const postsTree = postsTreeFromRawPosts({
      flatPostsArray: filteredPosts,
      users: this.state.users,
    });
    let posts = postsTree.posts;
    const countLowPriorityPosts = postsTree.data.countLowPriorityPosts;

    if (this.state.feed === 'notifications') {
      // TODO tests for this
      const topLevelPostIdsToAllow =
        flatPostsArray &&
        flatPostsArray
          .filter((post) => {
            const topLevel = !post.replyToId;
            if (!topLevel) {
              return false;
            }
            // const notYours = post.userId !== this.props.user.uid;
            // const youNeverReplied = flatPostsArray.every((p) => {
            //   return (
            //     p.userId !== this.props.user.uid || p.replyToId !== post.id
            //   );
            // });
            // const youNeverTagged =
            //   !post.tags ||
            //   Object.values(post.tags).every(
            //     (tag) => tag.userId !== this.props.user.uid
            //   );
            let mostRecentReply = null;
            flatPostsArray.forEach((p) => {
              if (
                p.replyToId &&
                p.replyToId === post.id &&
                (!mostRecentReply || p.timestamp > mostRecentReply.timestamp)
              )
                mostRecentReply = p;
            });
            const youAreNotMostRecentReplier =
              mostRecentReply && mostRecentReply.userId !== this.props.user.uid;

            return youAreNotMostRecentReplier;
          })
          .map((post) => post.id);
      posts = posts.filter((post) => topLevelPostIdsToAllow.includes(post.id));
      feedSubtext = 'Posts to which you did not post the most recent reply:';
    }

    return (
      <Row>
        <Col>
          <Mosaic />
        </Col>
        <Col sm={8} className="col-posts mt-3">
          <NewPostCard
            photoURL={this.props.user && this.props.user.photoURL}
            displayName={this.props.user && this.props.user.displayName}
            createNewPost={this.createNewPost}
          />

          <Nav className="justify-content-center">
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'notifications'}
                onClick={() => this.setState({ feed: 'notifications' })}
              >
                Notifications
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'smart'}
                onClick={() => this.setState({ feed: 'smart' })}
              >
                Smart Feed
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'all'}
                onClick={() => this.setState({ feed: 'all' })}
              >
                All Posts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.feed === 'feature request'}
                onClick={() => this.setState({ feed: 'feature request' })}
              >
                Feature Requests
              </Nav.Link>
            </Nav.Item>
          </Nav>

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
                  <tr key={post.id}>
                    <td>
                      <Card className={key !== '0' ? 'mt-2' : null}>
                        <Card.Body>
                          <PostHeader
                            displayName={post.userDisplayName}
                            showActions={
                              this.props.user &&
                              this.props.user.uid === post.userId
                            }
                            postActionsDropdown={
                              <PostActionsDropdown
                                deletePost={() => this.deletePost(post.id)}
                              />
                            }
                            timestamp={post.timestamp}
                            photoURL={post.userPhotoURL}
                            postId={post.id}
                          />
                          <PostContent>{post.content}</PostContent>
                          <div className="mt-2">
                            <PostTags
                              tags={post.tags}
                              myUserId={this.props.user && this.props.user.uid}
                              addTag={(content, successCallback) =>
                                this.addTag(
                                  post.id,
                                  content,
                                  successCallback,
                                  this.props.user && this.props.user.uid
                                )
                              }
                              postId={post.id}
                            />
                          </div>
                          <div className="mt-3">
                            {post &&
                              post.childNodes &&
                              post.childNodes.map((replyPost) => {
                                const showActions =
                                  this.props.user &&
                                  this.props.user.uid === replyPost.userId;
                                const postActionsDropdown = (
                                  <PostActionsDropdown
                                    deletePost={() =>
                                      this.deletePost(replyPost.id)
                                    }
                                  />
                                );
                                return (
                                  <ReplyPostCard
                                    key={replyPost.id}
                                    userDisplayName={replyPost.userDisplayName}
                                    showActions={showActions}
                                    postActionsDropdown={postActionsDropdown}
                                    timestamp={replyPost.timestamp}
                                    userPhotoURL={replyPost.userPhotoURL}
                                    content={replyPost.content}
                                    postTags={replyPost.tags}
                                    myUserId={
                                      this.props.user && this.props.user.uid
                                    }
                                    thisPostId={replyPost.id}
                                    addTag={this.addTag}
                                  />
                                );
                              }, this)}
                          </div>
                          {
                            // this is a dirty temp hack to avoid reply posts to reply posts, which are not currently handled
                            post.replyToId ? null : (
                              <ReplyForm
                                userPhotoURL={
                                  this.props.user && this.props.user.photoURL
                                }
                                createNewPost={this.createNewPost}
                                replyToPostId={post.id}
                              />
                            )
                          }
                        </Card.Body>
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
