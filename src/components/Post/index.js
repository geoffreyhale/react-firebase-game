import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import firebase, { auth } from '../../firebase.js';
import { AppContext } from '../AppProvider';
import Post from '../Posts/Post';
import postsTreeFromRawPosts from '../Posts/postsTreeFromRawPosts';
import { getUser, getUsers } from '../shared/db';

export default class PostPage extends React.Component {
  constructor() {
    super();
    this.state = {
      post: null,
      posts: [],
      users: null,
      message: 'Loading...',
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
          if (!post) {
            this.setState({ message: 'Post does not exist.' });
            return;
          }
          post.id = postId;
          this.setState({ post: post }, () => {
            const post = this.state.post;

            getUser(post.userId, (postUser) => {
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

            // TODO loop queries for reply posts of reply posts etc until no more new posts returning
          });
        });

        getUsers((users) => this.setState({ users }));
      }
    });
  }

  render() {
    const { post, posts, users } = this.state;

    if (!post || !users) {
      return <>{this.state.message}</>;
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
          <Card className="mt-4">
            <Card.Body>
              <Post
                post={postTree[0]}
                myPhotoURL={this.user().photoURL}
                hackDoNotAddPostToMessageLinkURL={true}
                hackHidePostLinks={true} // TODO current routing appends extra '/post''s
              />
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    );
  }
}
