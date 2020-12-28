import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase, { auth } from '../../firebase.js';
import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';
import formatDuration from 'date-fns/formatDuration';

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

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      posts: {},
      newPostContent: '',
    };
    this.createNewPost = this.createNewPost.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setPostsFromPostsSnapshot = this.setPostsFromPostsSnapshot.bind(this);
  }
  setPostsFromPostsSnapshot(snapshot) {
    let posts = snapshot.val();
    const postsByTimestamp = {};
    Object.keys(posts).forEach((k) => {
      postsByTimestamp[posts[k].timestamp] = posts[k];
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
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user }, () => {
          const postsRef = firebase.database().ref('posts');
          postsRef.on('value', (snapshot) => {
            this.setPostsFromPostsSnapshot(snapshot);
          });
        });
      }
    });
  }
  handleChange(event) {
    this.setState({ newPostContent: event.target.value });
  }
  createNewPost(e) {
    e.preventDefault();
    const uid = this.state.user && this.state.user.uid; //TODO
    const postsRef = firebase.database().ref('posts');
    const key = postsRef.push().key;
    postsRef
      .child(key)
      .update({
        content: this.state.newPostContent,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId: uid,
      })
      .then(() => {
        postsRef.once('value').then((snapshot) => {
          this.setPostsFromPostsSnapshot(snapshot);
        });
      });
  }
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>Actions</Card.Title>
            <div>
              <Form onSubmit={this.createNewPost}>
                <Form.Group controlId="newPostContent">
                  <Form.Control
                    type="text"
                    placeholder="How are you?"
                    value={this.state.newPostContent}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={this.state.newPostContent === ''}
                >
                  Create New Public Post
                </Button>
              </Form>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Public Posts</Card.Title>
            <table>
              <tbody>
                {Object.entries(this.state.posts).map(([key, value]) => {
                  return (
                    <tr>
                      <td>
                        <Card>
                          <Card.Body>
                            <Card.Title>{value.userId}</Card.Title>
                            <div className="text-muted">
                              {friendlyTimestamp(value.timestamp)}
                            </div>
                            <div>{value.content}</div>
                          </Card.Body>
                        </Card>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </>
    );
  }
}
