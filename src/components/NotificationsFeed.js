import React, { useContext } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';
import { useHistory, useLocation } from 'react-router-dom';
import { removeNotification } from '../api/index';
import { AppContext } from './AppProvider';
import firebase from './firebase.js';
import friendlyTimestamp from './shared/friendlyTimestamp';
import { UserPhoto } from './shared/User';

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
          uid: user.uid,
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
        //TODO omg db call for each!?
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

    const Notifications = (
      <>
        {hasNotifications ? null : 'None'}
        <Table hover>
          <tbody>
            {hasNotifications
              ? notifications.map((notification) => (
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
      </>
    );

    return (
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <Popover id="popover-basic">
            <Popover.Title as="h3">Notifications</Popover.Title>
            <Popover.Content>{Notifications}</Popover.Content>
          </Popover>
        }
      >
        <div style={{ position: 'relative' }}>
          <i
            class="fas fa-bell fa-fw"
            style={{ verticalAlign: 'middle', fontSize: '35px' }}
          ></i>{' '}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Badge
              variant="secondary"
              style={{
                backgroundColor: 'rgba(32, 156, 238, 0.95)',
                backgroundOpacity: '50%',
              }}
            >
              {hasNotifications ? notifications.length : 0}
            </Badge>
          </div>
        </div>
      </OverlayTrigger>
    );
  }
}
