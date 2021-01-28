import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import firebase from '../firebase.js';
import { AppContext } from '../AppProvider';
import Spinner from '../shared/Spinner';
import Mosaic from './Mosaic';
import Stats from './Stats';
import PremiumFeature from '../shared/PremiumFeature';

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
    if (!this.user().isPremium) {
      return <PremiumFeature featureName={'Community Page'} />;
    }

    const users = this.users();
    if (!users) {
      <Spinner />;
    }

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
