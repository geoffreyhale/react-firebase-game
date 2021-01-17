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
    this.state = { postIds: [] };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  db = () => firebase.database();
  notificationsRef = () => this.db().ref('notifications/' + this.user().uid);

  componentDidMount() {
    this.notificationsRef()
      .once('value') // use .on
      .then((snapshot) => {
        const notificationsObject = snapshot.val();
        const postIds = notificationsObject && Object.keys(notificationsObject);
        this.setState({
          postIds: postIds,
        });
        hackCleanupNotifications(this.user().uid, postIds); // make better
      });
  }

  render() {
    return (
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Notifications</Card.Title>
          {this.state.postIds
            ? this.state.postIds.map((postId) => (
                <div>
                  <Link to={`post/${postId}`}>{postId}</Link>
                </div>
              ))
            : 'None'}
        </Card.Body>
      </Card>
    );
  }
}
