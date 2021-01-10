import React from 'react';
import firebase, { auth } from '../../firebase.js';

export default class Post extends React.Component {
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
          this.setState({ post: snapshot.val() });
        });
      }
    });
  }
  render() {
    return <>{this.state.post && this.state.post.content}</>;
  }
}
