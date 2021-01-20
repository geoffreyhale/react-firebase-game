import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useHistory } from 'react-router-dom';
import firebase from '../../firebase.js';
import { AppContext } from '../AppProvider';
import { getUsers, removeNotification } from '../shared/db';
import friendlyTimestamp from '../shared/friendlyTimestamp';

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

const RemoveNotificationButton = ({ postId, userId }) => {
  const { user } = useContext(AppContext);
  return (
    <Button
      variant="outline-danger"
      size="sm"
      onClick={() =>
        removeNotification({
          postId: postId,
          myUserId: user.uid,
          userId: userId,
        })
      }
    >
      x
    </Button>
  );
};

const NotificationItem = ({ notification }) => {
  const { content, postId, userId } = notification;
  const history = useHistory();
  return (
    <tr>
      <td
        // onClick doesn't allow right-click on anchor functionality
        // but cannot find cleaner way to link a whole cell (or row) atm
        onClick={() => {
          history.push('post/' + postId);
        }}
      >
        {content}
      </td>
      <td>
        <RemoveNotificationButton postId={postId} userId={userId} />
      </td>
    </tr>
  );
};

const NotificationItemLinkContent = ({
  userDisplayName,
  userPhotoURL,
  postId,
  timestamp,
}) => (
  <span>
    {userPhotoURL ? (
      <img
        src={userPhotoURL}
        alt="user"
        style={{ height: 38 }}
        className="mr-2 float-left"
      />
    ) : null}
    <strong style={{ fontWeight: 700 }}>{userDisplayName}</strong>
    {` replied to your post `}
    {friendlyTimestamp(timestamp, ' ago', { fontWeight: 600 })}.
  </span>
);

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
    getUsers((users) => {
      this.setState({ users });
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
                content: `${nItem} replies to your post ${postId}`,
              });
            } else if (typeof nItem === 'object') {
              Object.entries(nItem).forEach(([userId, timestamp]) => {
                const userDisplayName =
                  this.state.users &&
                  this.state.users[userId] &&
                  this.state.users[userId].displayName;
                const userPhotoURL =
                  this.state.users &&
                  this.state.users[userId] &&
                  this.state.users[userId].photoURL;
                notifications.push({
                  postId,
                  userId,
                  content: (
                    <NotificationItemLinkContent
                      userDisplayName={userDisplayName}
                      userPhotoURL={userPhotoURL}
                      postId={postId}
                      timestamp={timestamp}
                    />
                  ),
                  timestamp,
                });
              });
            }
          });
        }
        notifications.sort((a, b) => {
          return b.timestamp - a.timestamp;
        });
        this.setState({
          notifications: notifications,
        });
        postIds && hackCleanupNotifications(this.user().uid, postIds); // make better
      });
    });
    // TODO removeNotification does't update the feed
  }

  render() {
    return (
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Notifications</Card.Title>
          <Table hover>
            <tbody>
              {this.state.notifications && this.state.notifications.length > 0
                ? this.state.notifications.map((notification) => (
                    <NotificationItem notification={notification} />
                  ))
                : 'None'}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}
