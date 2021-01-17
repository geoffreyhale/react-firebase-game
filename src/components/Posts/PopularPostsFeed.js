import React from 'react';
import firebase from '../../firebase.js';
import { AppContext } from '../AppProvider';
import { getUser, getUsers } from '../shared/db';

export default class PopularPostsFeed extends React.Component {
  constructor() {
    super();
    this.state = {};
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
        this.setState({ rawPosts: posts });
      });
    });
  }

  render() {
    return 'PopularPostsFeed';
  }
}
