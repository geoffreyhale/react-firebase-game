import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import firebase, { auth } from '../../firebase.js';
import { AppContext } from '../AppProvider';
import Post from '../Posts/Post';
import postsTreeFromRawPosts from '../Posts/postsTreeFromRawPosts';

export default class PostPage extends React.Component {
  constructor() {
    super();
    this.state = {
      post: null,
      posts: [],
      users: null,
    };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      const postId = this.props.match.params.postId;
      if (user) {
        const postRef = firebase.database().ref('posts/' + postId);
        postRef.once('value', (snapshot) => {
          const post = snapshot.val();
          post.id = postId;
          this.setState({ post: post }, () => {
            const post = this.state.post;

            const postUserRef = firebase.database().ref('users/' + post.userId);
            postUserRef.once('value', (snapshot) => {
              const postUser = snapshot.val();
              post.userDisplayName = postUser.displayName;
              post.userPhotoURL = postUser.photoURL;
              this.setState({ post: post });
            });

            const postsRef = firebase.database().ref('posts/');
            postsRef
              .orderByChild('replyToId')
              .equalTo(postId)
              .on('value', (snapshot) => {
                const posts = snapshot.val();
                const postsArray = posts
                  ? Object.entries(posts).map(([id, post]) => {
                      post.id = id;
                      return post;
                    })
                  : [];
                this.setState({ posts: postsArray });
              });
          });
        });

        const usersRef = firebase.database().ref('users');
        usersRef.once('value', (usersSnapshot) => {
          this.setState({ users: usersSnapshot.val() });
        });
      }
    });
  }

  render() {
    const { post, posts, users } = this.state;
    const user = this.user();

    if (!post || !users) {
      return <>Loading</>;
    }

    const flatPostsArray = posts;
    flatPostsArray.push(post);

    const postsTree = postsTreeFromRawPosts({
      flatPostsArray: flatPostsArray,
      users: users,
    });
    const postTree = postsTree.posts;

    return (
      <Row>
        <Col></Col>
        <Col sm={8} className="col-posts mt-3">
          <Post
            post={postTree[0]}
            myUserId={user && user.uid}
            myPhotoURL={user && user.photoURL}
            // createNewPost={this.createNewPost}
            // deletePost={this.deletePost}
            // addTag={this.addTag}
            hackDoNotAddPostToMessageLinks={true}
          />
          <small className="text-muted">Limited functionality.</small>
        </Col>
        <Col></Col>
      </Row>
    );
  }
}
