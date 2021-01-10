import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import firebase, { auth } from '../../firebase.js';
import Post from '../Posts/Post';

export default class PostPage extends React.Component {
  constructor() {
    super();
    this.state = {
      post: {},
    };
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const postRef = firebase
          .database()
          .ref('posts/' + this.props.match.params.postId);
        postRef.once('value', (snapshot) => {
          const post = snapshot.val();
          this.setState({ post: post }, () => {
            const postUserRef = firebase.database().ref('users/' + post.userId);
            postUserRef.once('value', (snapshot) => {
              const postUser = snapshot.val();
              const post = this.state.post;
              post.userDisplayName = postUser.displayName;
              post.userPhotoURL = postUser.photoURL;
              this.setState({ post: post });
            });
          });
        });
      }
    });
  }
  render() {
    const { post } = this.state;
    const { user } = this.props;
    return (
      <Row>
        <Col></Col>
        <Col sm={8} className="col-posts mt-3">
          <Post
            post={post}
            myUserId={user && user.uid}
            myPhotoURL={user && user.photoURL}
            // createNewPost={this.createNewPost}
            // deletePost={this.deletePost}
            // addTag={this.addTag}
          />
          <small className="text-muted">
            Limited functionality and reply posts not shown.
          </small>
        </Col>
        <Col></Col>
      </Row>
    );
  }
}
