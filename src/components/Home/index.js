import React, { Component } from 'react';
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
  const formattedTimestamp = format(
    timestampDate,
    "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
  );
  const duration = intervalToDuration({
    start: timestampDate,
    end: new Date(),
  });
  const formattedDuration = formatDuration(duration);
  return `${formattedTimestamp} (${formattedDuration})`;
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
      postsByTimestamp[post.timestamp] = post;
    });
    const postsByTimestampOrdered = Object.keys(postsByTimestamp)
      .sort((a, b) => b - a)
      .reduce((result, key) => {
        result[key] = postsByTimestamp[key];
        return result;
      }, {});
    const postsTreeWithReplies = createDataTree(
      Object.values(postsByTimestampOrdered)
    );
    this.setState({
      rawPosts: rawPosts,
      postsTree: postsTreeWithReplies, //TODO make this functional down in view components
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
                          <Card.Title>
                            {value.userDisplayName}
                            <div className="float-right">
                              {this.props.user &&
                              this.props.user.uid === value.userId ? (
                                <PostActionsDropdown
                                  deletePost={() => this.deletePost(value.id)}
                                />
                              ) : null}
                            </div>
                          </Card.Title>
                          <div className="text-muted">
                            {friendlyTimestamp(value.timestamp)}
                          </div>
                          <div>{value.content}</div>
                          <div className="mt-3" style={{ width: '100%' }}>
                            <NewPostForm
                              onSubmit={this.createNewPost}
                              placeholder="Write a reply..."
                              hideSubmitButton={true}
                              replyToId={value.id}
                            />
                          </div>
                          {value &&
                            value.childNodes &&
                            value.childNodes.map((replyPost) => {
                              return (
                                <Card>
                                  <Card.Body>
                                    <Card.Title>
                                      {replyPost.userDisplayName}
                                      <div className="float-right">
                                        {this.props.user &&
                                        this.props.user.uid ===
                                          replyPost.userId ? (
                                          <PostActionsDropdown
                                            deletePost={() =>
                                              this.deletePost(replyPost.id)
                                            }
                                          />
                                        ) : null}
                                      </div>
                                    </Card.Title>
                                    <div className="text-muted">
                                      {friendlyTimestamp(replyPost.timestamp)}
                                    </div>
                                    <div>{replyPost.content}</div>
                                    <div
                                      className="mt-3"
                                      style={{ width: '100%' }}
                                    >
                                      {
                                        this.props.user &&
                                        this.props.user.uid === replyPost.userId
                                          ? null
                                          : null
                                        // <NewPostForm
                                        //   onSubmit={this.createNewPost}
                                        //   placeholder="Write a reply..."
                                        //   hideSubmitButton={true}
                                        //   replyToId={replyPost.id}
                                        // />
                                      }
                                    </div>
                                  </Card.Body>
                                </Card>
                              );
                            }, this)}
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
