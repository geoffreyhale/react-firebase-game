import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import firebase from '../../firebase.js';
import { AppContext } from '../AppProvider';
import { removeNotification } from '../shared/db';

// appears to remove notifications for your posts that don't exist anymore
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
      const notifications = [];
      const postIds = [];
      if (notificationsObject) {
        Object.entries(notificationsObject).forEach(([key, nItem]) => {
          const postId = key;
          postIds.push(postId);
          // TODO get rid of notifications in db that are just the old count style
          if (typeof nItem === 'number') {
            notifications.push({
              postId,
              message: `${nItem} replies to your post ${postId}`,
            });
          } else if (typeof nItem === 'object') {
            Object.entries(nItem).forEach(([userId, timestamp]) => {
              notifications.push({
                postId,
                userId,
                message: `${userId} replied to your post ${postId} at ${timestamp}`,
              });
            });
          }
        });
      }
      this.setState({
        notifications: notifications,
      });
      postIds && hackCleanupNotifications(this.user().uid, postIds); // make better
    });
    // TODO removeNotification does't update the feed
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
                    {notification.message}
                  </Link>
                  <a
                    className={'ml-2'}
                    style={{ color: 'red' }}
                    onClick={() =>
                      removeNotification({
                        postId: notification.postId,
                        myUserId: this.user().uid,
                        userId: notification.userId,
                      })
                    }
                  >
                    remove
                  </a>
                </div>
              ))
            : 'None'}
        </Card.Body>
      </Card>
    );
  }
}
