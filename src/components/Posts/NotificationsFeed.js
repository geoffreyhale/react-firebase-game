import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import firebase from '../../firebase.js';
import { AppContext } from '../AppProvider';

const hackCleanupNotifications = (userId, postIds) => {
  const notificationsRef = firebase.database().ref('notifications/' + userId);
  postIds &&
    postIds.forEach((postId) => {
      firebase
        .database()
        .ref('posts/' + postId)
        .once('value')
        .then((snapshot) => {
          const exists = !!snapshot.val();
          if (!exists) {
            notificationsRef.child(postId).remove();
          }
        });
    });
};

export default class NotificationsFeed extends React.Component {
  constructor() {
    super();
    this.state = { notifications: [] };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  db = () => firebase.database();
  notificationsRef = () => this.db().ref('notifications/' + this.user().uid);

  componentDidMount() {
    this.notificationsRef().on('value', (snapshot) => {
      const notificationsObject = snapshot.val();
      if (notificationsObject) {
        const notifications = [];
        const postIds = [];
        Object.entries(notificationsObject).forEach(([key, value]) => {
          const postId = key;
          const count = value;
          postIds.push(postId);
          notifications.push({ postId, count });
        });
        this.setState({
          notifications: notifications,
        });
        hackCleanupNotifications(this.user().uid, postIds); // make better
      }
    });
  }

  render() {
    return (
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Notifications</Card.Title>
          {this.state.notifications && this.state.notifications.length > 0
            ? this.state.notifications.map((notification) => (
                <div key={notification.postId}>
                  <Link to={`post/${notification.postId}`}>
                    {notification.count} replies to your post{' '}
                    {notification.postId}
                  </Link>
                </div>
              ))
            : 'None'}
        </Card.Body>
      </Card>
    );
  }
}
