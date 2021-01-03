import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase, { auth } from '../../firebase.js';
import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';

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
          this.props.onSubmit(this.state.content, successCallback);
        }}
      >
        <Form.Group controlId="content">
          <Form.Control
            type="text"
            placeholder="How are you?"
            value={this.state.content}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={this.state.content === ''}
        >
          Post
        </Button>
      </Form>
    );
  }
}

export default class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: {},
    };
    this.createNewPost = this.createNewPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.setPostsFromPostsSnapshot = this.setPostsFromPostsSnapshot.bind(this);
  }
  setPostsFromPostsSnapshot(posts, users) {
    //TODO write tests for this function
    const postsByTimestamp = {};
    Object.keys(posts).forEach((postId) => {
      const post = posts[postId];
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
    this.setState({
      posts: postsByTimestampOrdered,
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
  createNewPost(newPostContent, successCallback) {
    const uid = this.props.user && this.props.user.uid;
    const postsRef = firebase.database().ref('posts');
    const key = postsRef.push().key;
    postsRef
      .child(key)
      .update({
        content: newPostContent,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId: uid,
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
    const post = this.state.posts[statePostsKey];
    const postsRef = firebase.database().ref('posts');
    postsRef.child(post.id).remove();
  }
  render() {
    return (
      <Row>
        <Col></Col>
        <Col xs={8}>
          <Card className="mb-3">
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
              <div>
                <NewPostForm onSubmit={this.createNewPost} />
              </div>
            </Card.Body>
          </Card>
          <table>
            <tbody>
              {Object.entries(this.state.posts).map(([key, value]) => {
                return (
                  <tr key={key}>
                    <td>
                      <Card className="mb-2">
                        <Card.Body>
                          <Card.Title>{value.userDisplayName}</Card.Title>
                          <div className="text-muted">
                            {friendlyTimestamp(value.timestamp)}
                          </div>
                          <div>{value.content}</div>
                        </Card.Body>
                        <div style={{ width: '100%' }}>
                          {this.props.user &&
                          this.props.user.uid === value.userId ? (
                            <Button
                              variant="outline-danger"
                              type="button"
                              onClick={() => this.deletePost(key)}
                              className="float-right"
                            >
                              Delete
                            </Button>
                          ) : null}
                        </div>
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
