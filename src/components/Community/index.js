import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import firebase from '../../firebase.js';
import { AppContext } from '../AppProvider';
import postsTreeFromRawPosts from '../shared/postsTreeFromRawPosts';
import Spinner from '../shared/Spinner';
import Mosaic from './Mosaic';
import Stats from './Stats';

export default class CommunityPage extends Component {
  constructor() {
    super();
    this.state = {
      rawPosts: {},
    };
  }

  static contextType = AppContext;
  user = () => this.context.user;
  users = () => this.context.users;
  db = () => firebase.database();
  postsRef = () => this.db().ref('posts');

  componentDidMount() {
    this.postsRef().on('value', (postsSnapshot) => {
      const posts = postsSnapshot.val();
      this.setState({ rawPosts: posts });
    });
  }

  render() {
    const users = this.users();
    if (!users) {
      <Spinner />;
    }

    const flatPostsArray = Object.entries(this.state.rawPosts).map(
      ([id, post]) => {
        post.id = id;
        return post;
      }
    );

    let filteredPosts = flatPostsArray;

    const postsTree = postsTreeFromRawPosts({
      flatPostsArray: filteredPosts,
      users,
    });
    let { posts } = postsTree;

    return (
      <>
        <Row>
          <Col>
            <Mosaic />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Stats posts={this.state.rawPosts} />
          </Col>
        </Row>
      </>
    );
  }
}
