import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import firebase from '../../firebase.js';
import { AppContext } from '../AppProvider';
import Post from '../Posts/Post';
import { getUsers } from '../shared/db';
import postsTreeFromRawPosts from '../shared/postsTreeFromRawPosts';

const searchTree = ({ postId, post, key = 'childNodes' }) => {
  if (post.id === postId) {
    return post;
  } else if (post[key]) {
    var i;
    var result = null;
    for (i = 0; result == null && i < post[key].length; i++) {
      result = searchTree({ postId, post: post[key][i] });
    }
    return result;
  }
  return null;
};

export default class PostPage extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      users: null,
      message: 'Loading...',
    };
  }

  static contextType = AppContext;
  user = () => this.context.user;
  db = () => firebase.database();
  postsRef = () => this.db().ref('posts');

  componentDidMount() {
    getUsers((users) => {
      this.setState({
        users,
      });
      this.postsRef().on('value', (postsSnapshot) => {
        const posts = postsSnapshot.val();
        this.setState({ posts });
      });
    });
  }

  render() {
    const postId = this.props.match.params.postId;
    const { posts, users } = this.state;

    if (!postId || !posts || posts.length === 0 || !users) {
      return <>{this.state.message}</>;
    }

    const flatPostsArray = Object.entries(posts).map(([id, post]) => {
      post.id = id;
      return post;
    });

    const postsTree = postsTreeFromRawPosts({
      flatPostsArray: flatPostsArray,
      users: users,
    });
    const postTree = postsTree.posts;

    const post = searchTree({ postId, post: { childNodes: postTree } });

    if (!post) {
      return <>Post not found!</>;
    }

    return (
      <Row>
        <Col></Col>
        <Col sm={8} className="col-posts mt-3">
          <Card className="mt-4">
            <Card.Body>
              <Post
                post={post}
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
