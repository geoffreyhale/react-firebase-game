import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import firebase, { auth } from '../../firebase.js';
import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';
import MyDropdownToggle from '../shared/MyDropdownToggle';
import Stats from './Stats';

//TODO write tests for this function
//adapted from https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript
const createDataTree = (dataset) => {
  const hashTable = Object.create(null);
  dataset.forEach(
    (aData) => (hashTable[aData.id] = { ...aData, childNodes: [] })
  );
  const dataTree = [];
  dataset.forEach((aData) => {
    if (aData.replyToId && hashTable[aData.replyToId]) {
      hashTable[aData.replyToId].childNodes.push(hashTable[aData.id]);
    } else {
      dataTree.push(hashTable[aData.id]);
    }
  });
  return dataTree;
};

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

class NewPostForm extends React.Component {
  constructor() {
    super();
    this.state = {
      content: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ content: event.target.value });
  }
  render() {
    return (
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const successCallback = () => this.setState({ content: '' });
          this.props.onSubmit(
            this.state.content,
            this.props.replyToId || null,
            successCallback
          );
        }}
      >
        <Form.Control
          type="text"
          placeholder={this.props.placeholder || 'How are you?'}
          value={this.state.content}
          onChange={this.handleChange}
          size={this.props.size}
        />
        {!this.props.hideSubmitButton && (
          <Button
            className="mt-3"
            variant="primary"
            type="submit"
            disabled={this.state.content === ''}
          >
            Post
          </Button>
        )}
      </Form>
    );
  }
}

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
      <div className="small text-muted">{friendlyTimestamp(timestamp)}</div>
    </>
    <div style={{ clear: 'both' }}></div>
  </div>
);

const PostContent = ({ children, small }) => (
  <div className="mt-1" style={{ fontSize: small ? '85%' : null }}>
    {children}
  </div>
);

const Tag = ({ type, variant }) => {
  // if (type === 'productive') {
  //   return (
  //     <Badge
  //       pill
  //       variant="dark"
  //       style={{ backgroundColor: 'lightbrown !important' }}
  //     >
  //       {type}
  //     </Badge>
  //   );
  // }
  return (
    <Badge pill variant={variant || 'secondary'}>
      {type}
    </Badge>
  );
};

const PostTags = ({ tags, myUserId, addTag, postId }) => {
  return (
    <div>
      {tags &&
        Object.values(tags).map((tag) => {
          const tagUniqueKey = postId + tag.userId + tag.type + Math.random();
          if (tag.userId === myUserId) {
            return <Tag type={tag.type} variant="info" key={tagUniqueKey} />;
          }
          return <Tag type={tag.type} key={tagUniqueKey} />;
        })}
      <div className={'mt-1'}>
        <NewPostForm
          onSubmit={(content, replyToId, successCallback) => {
            addTag(content, successCallback);
          }}
          placeholder="tag"
          hideSubmitButton={true}
          size={'sm'}
        />
      </div>
    </div>
  );
};

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
        <NewPostForm onSubmit={createNewPost} />
      </Card.Body>
    </Card>
  );
};

const ReplyCard = ({
  userDisplayName,
  showActions,
  postActionsDropdown,
  timestamp,
  userPhotoURL,
  content,
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
        />
        <PostContent>{content}</PostContent>
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
      postsTree: [],
    };
    this.createNewPost = this.createNewPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.setPostsFromPostsSnapshot = this.setPostsFromPostsSnapshot.bind(this);
  }
  setPostsFromPostsSnapshot(rawPosts, users) {
    //TODO write tests for this function
    const postsByTimestamp = {};
    Object.keys(rawPosts).forEach((postId) => {
      const post = rawPosts[postId];
      post.id = postId;
      post.userDisplayName =
        (users[post.userId] && users[post.userId].displayName) ||
        'USER NAME NOT FOUND';
      post.userPhotoURL =
        (users[post.userId] && users[post.userId].photoURL) || null;
      postsByTimestamp[post.timestamp] = post;
    });
    const postsChronological = Object.keys(postsByTimestamp)
      .sort((a, b) => a - b)
      .reduce((result, key) => {
        result[key] = postsByTimestamp[key];
        return result;
      }, {});
    const postsTreeWithReplies = createDataTree(
      Object.values(postsChronological)
    );
    const postsTreeReverseChronological = postsTreeWithReplies.sort(
      (a, b) => b.timestamp - a.timestamp
    );
    this.setState({
      rawPosts: rawPosts,
      postsTree: postsTreeReverseChronological, //TODO make this functional down in view components
    });
    return true;
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const postsRef = firebase.database().ref('posts');
        postsRef.on('value', (snapshot) => {
          const usersRef = firebase.database().ref('users');
          usersRef.once('value', (usersSnapshot) => {
            this.setPostsFromPostsSnapshot(
              snapshot.val(), //TODO bad javascript
              usersSnapshot.val()
            );
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
      .then(() => {
        postsRef.once('value').then((snapshot) => {
          const usersRef = firebase.database().ref('users');
          usersRef.once('value', (usersSnapshot) => {
            this.setPostsFromPostsSnapshot(
              snapshot.val(), //TODO bad javascript
              usersSnapshot.val()
            );
          });
        });
      })
      .then(successCallback());
  }
  deletePost(statePostsKey) {
    const post = this.state.rawPosts[statePostsKey];
    const postsRef = firebase.database().ref('posts');
    postsRef.child(post.id).remove();
  }
  addTag(postId, tagContent, successCallback) {
    const uid = this.props.user && this.props.user.uid;
    const postRef = firebase.database().ref('posts/' + postId);
    const key = postRef.child('tags').push().key;
    postRef
      .child('tags')
      .child(key)
      .update({
        type: tagContent,
        userId: uid,
      })
      .then(() => {
        const postsRef = firebase.database().ref('posts');
        postsRef.once('value').then((snapshot) => {
          const usersRef = firebase.database().ref('users');
          usersRef.once('value', (usersSnapshot) => {
            this.setPostsFromPostsSnapshot(
              snapshot.val(), //TODO bad javascript
              usersSnapshot.val()
            );
          });
        });
      })
      .then(successCallback());
  }
  render() {
    return (
      <Row>
        <Col></Col>
        <Col sm={8} className="col-posts">
          <NewPostCard
            photoURL={this.props.user && this.props.user.photoURL}
            displayName={this.props.user && this.props.user.displayName}
            createNewPost={this.createNewPost}
          />
          <table>
            <tbody>
              {Object.entries(this.state.postsTree).map(([key, post]) => {
                return (
                  <tr key={post.id}>
                    <td>
                      <Card className="mt-2">
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
                          />
                          <PostContent>{post.content}</PostContent>
                          <div className="mt-2">
                            <PostTags
                              tags={post.tags}
                              myUserId={this.props.user && this.props.user.uid}
                              addTag={(content, successCallback) =>
                                this.addTag(post.id, content, successCallback)
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
                                  <ReplyCard
                                    key={replyPost.id}
                                    userDisplayName={replyPost.userDisplayName}
                                    showActions={showActions}
                                    postActionsDropdown={postActionsDropdown}
                                    timestamp={replyPost.timestamp}
                                    userPhotoURL={replyPost.userPhotoURL}
                                    content={replyPost.content}
                                  />
                                );
                              }, this)}
                          </div>
                          <ReplyForm
                            userPhotoURL={
                              this.props.user && this.props.user.photoURL
                            }
                            createNewPost={this.createNewPost}
                            replyToPostId={post.id}
                          />
                        </Card.Body>
                      </Card>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Col>
        <Col>
          <div id="post-stats">
            <Stats posts={this.state.rawPosts} />
          </div>
        </Col>
      </Row>
    );
  }
}
