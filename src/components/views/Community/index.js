import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import firebase from '../../firebase.js';
import { AppContext } from '../../AppProvider';
import Spinner from '../../shared/Spinner';
import { PremiumFeature } from '../../shared/Premium';
import Mosaic from './Mosaic';
import Stats from './Stats';
import UserScoreCards from './UserScoreCards';

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
      <Spinner size="lg" />;
    }

    return (
      <>
        <Mosaic />
        <Tabs defaultActiveKey="scores" className="mt-3">
          <Tab eventKey="scores" title="Scores">
            <UserScoreCards />
          </Tab>
          <Tab eventKey="stats" title="Stats">
            <Stats posts={this.state.rawPosts} />
          </Tab>
        </Tabs>
      </>
    );
  }
}
