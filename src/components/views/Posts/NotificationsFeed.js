import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useHistory, useLocation } from 'react-router-dom';
import firebase from '../../firebase.js';
import { AppContext } from '../../AppProvider';
import { getUsers, removeNotification } from '../../../api/index';
import friendlyTimestamp from '../../shared/friendlyTimestamp';
import { UserPhoto } from '../../shared/User';

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

const NotificationItem = ({ content, postId, url, userId }) => {
  const history = useHistory();
  const location = useLocation();
  const active = location.pathname.indexOf(postId) !== -1 ? true : false;
  const bootstrapTableHoverColor = 'rgba(0,0,0,.075)';
  return (
    <tr
      style={{ backgroundColor: active ? bootstrapTableHoverColor : 'inherit' }}
      key={postId + userId}
    >
      <td
        // onClick doesn't allow right-click on anchor functionality
        // but cannot find cleaner way to link a whole cell (or row) atm
        onClick={() => {
          history.push(url);
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

const NotificationItemLinkContent = ({ timestamp, uid }) => {
  const { users } = useContext(AppContext);
  const user = users && users[uid];
  const userDisplayName = user && user.displayName;
  return (
    <span>
      <div className="mr-2 float-left">
        <UserPhoto uid={uid} size={38} />
      </div>
      <strong style={{ fontWeight: 700 }}>{userDisplayName}</strong>
      {` replied to your post `}
      {friendlyTimestamp(timestamp, ' ago', { fontWeight: 600 })}.
    </span>
  );
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
          if (typeof nItem === 'object') {
            // TODO this is a hack to get room from post, but could be dup in notifications
            this.db()
              .ref('posts/' + postId + '/room')
              .once('value', (snapshot) => {
                const room = snapshot.val();
                if (room) {
                  Object.entries(nItem).forEach(([userId, timestamp]) => {
                    notifications.push({
                      postId,
                      room,
                      userId,
                      content: (
                        <NotificationItemLinkContent
                          timestamp={timestamp}
                          uid={userId}
                        />
                      ),
                      timestamp,
                    });
                  });
                }
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
    // TODO removeNotification does't update the feed
  }

  render() {
    const notifications = this.state.notifications;
    const hasNotifications = notifications && notifications.length > 0;
    return (
      <Card>
        <Card.Body>
          <Card.Title>Notifications</Card.Title>
          {hasNotifications ? null : 'None'}
          <Table hover>
            <tbody>
              {hasNotifications
                ? this.state.notifications.map((notification) => (
                    <NotificationItem
                      key={Math.random()}
                      content={notification.content}
                      postId={notification.postId}
                      userId={notification.userId}
                      url={
                        '/r/' +
                        notification.room +
                        '/posts/' +
                        notification.postId
                      }
                    />
                  ))
                : null}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}
