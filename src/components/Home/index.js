import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase, { auth } from '../../firebase.js';
import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';

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
    <Dropdown.Toggle
      size="sm"
      style={{ backgroundColor: 'inherit', border: 'none', color: 'grey' }}
    ></Dropdown.Toggle>

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

const PostTags = ({ tags, myUserId, addTag }) => {
  return (
    <div>
      {tags &&
        Object.values(tags).map((tag) => {
          if (tag.userId === myUserId) {
            return <Tag type={tag.type} variant="info" />;
          }
          return <Tag type={tag.type} />;
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
        this.setState({ user }, () => {
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
        <Col xs={8}>
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>
                {this.props.user && this.props.user.photoURL ? (
                  <img
                    src={this.props.user.photoURL}
                    alt="user"
                    style={{ height: 48 }}
                  />
                ) : null}
                {this.props.user && this.props.user.displayName}
                <small className="text-muted ml-2">&#127757; Public</small>
              </Card.Title>
              <NewPostForm onSubmit={this.createNewPost} />
            </Card.Body>
          </Card>
          <table>
            <tbody>
              {Object.entries(this.state.postsTree).map(([key, value]) => {
                return (
                  <tr key={key}>
                    <td>
                      <Card className="mt-2">
                        <Card.Body>
                          <PostHeader
                            displayName={value.userDisplayName}
                            showActions={
                              this.props.user &&
                              this.props.user.uid === value.userId
                            }
                            postActionsDropdown={
                              <PostActionsDropdown
                                deletePost={() => this.deletePost(value.id)}
                              />
                            }
                            timestamp={value.timestamp}
                            photoURL={value.userPhotoURL}
                          />
                          <PostContent>{value.content}</PostContent>
                          <div className="mt-2">
                            <PostTags
                              tags={value.tags}
                              myUserId={this.props.user && this.props.user.uid}
                              addTag={(content, successCallback) =>
                                this.addTag(value.id, content, successCallback)
                              }
                            />
                          </div>
                          <div className="mt-3">
                            {value &&
                              value.childNodes &&
                              value.childNodes.map((replyPost) => {
                                return (
                                  <Card className="mt-1">
                                    <Card.Body style={{ padding: '0.75rem' }}>
                                      <PostHeader
                                        displayName={replyPost.userDisplayName}
                                        showActions={
                                          this.props.user &&
                                          this.props.user.uid ===
                                            replyPost.userId
                                        }
                                        postActionsDropdown={
                                          <PostActionsDropdown
                                            deletePost={() =>
                                              this.deletePost(replyPost.id)
                                            }
                                          />
                                        }
                                        timestamp={replyPost.timestamp}
                                        photoURL={replyPost.userPhotoURL}
                                        small={true}
                                      />
                                      <PostContent>
                                        {replyPost.content}
                                      </PostContent>
                                    </Card.Body>
                                  </Card>
                                );
                              }, this)}
                          </div>
                          <div
                            className="mt-3"
                            style={{
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'row',
                            }}
                          >
                            <div
                              className={'mr-2'}
                              style={{ alignSelf: 'flex-start' }}
                            >
                              {this.props.user && this.props.user.photoURL ? (
                                <img
                                  src={this.props.user.photoURL}
                                  alt="user"
                                  style={{ height: 38 }}
                                />
                              ) : null}
                            </div>
                            <div style={{ flexGrow: 1 }}>
                              <NewPostForm
                                onSubmit={this.createNewPost}
                                placeholder="Write a reply..."
                                hideSubmitButton={true}
                                replyToId={value.id}
                              />
                            </div>
                          </div>
                        </Card.Body>
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
