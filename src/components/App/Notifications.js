import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import React, { useContext } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';
import { useHistory, useLocation } from 'react-router-dom';
import { getPosts, removeNotification } from '../../api/index';
import { AppContext } from '../AppProvider';
import firebase from '../firebase.js';
import friendlyTimestamp from '../shared/friendlyTimestamp';
import Spinner from '../shared/Spinner';
import { UserPhoto } from '../shared/User';

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

const NotificationItemLinkContent = ({ timestamp, uid, type = null }) => {
  const { users } = useContext(AppContext);
  const user = users && users[uid];
  const userDisplayName = user && user.displayName;
  return (
    <span>
      <div className="mr-2 float-left">
        <UserPhoto uid={uid} size={38} />
      </div>
      <strong style={{ fontWeight: 700 }}>{userDisplayName}</strong>
      {type === 'mention' ? ' mentioned you ' : ` replied to your post `}
      {friendlyTimestamp(timestamp, ' ago', { fontWeight: 600 })}.
    </span>
  );
};

const NotificationBellIcon = ({ children, loading }) => (
  <div style={{ position: 'relative' }}>
    <FontAwesomeIcon
      icon={faBell}
      className="fa-fw"
      style={{ verticalAlign: 'middle', fontSize: '35px' }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
      }}
    >
      {loading ? (
        <Spinner size={'sm'} />
      ) : (
        <Badge
          variant="secondary"
          style={{
            backgroundColor: 'rgba(32, 156, 238, 0.95)',
            backgroundOpacity: '50%',
          }}
        >
          {children}
        </Badge>
      )}
    </div>
  </div>
);

export default class Notifications extends React.Component {
  constructor() {
    super();
    this.state = { loading: true, notifications: [] };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  db = () => firebase.database();
  notificationsRef = () => this.db().ref('notifications/' + this.user().uid);

  componentDidMount() {
    this.notificationsRef().on('value', (snapshot) => {
      const notificationsData = snapshot.val();
      const notifications = [];
      if (notificationsData) {
        // TODO this is a hack to get room from post, but could be dup in notifications
        // TODO posts should be linkable by id alone, no room necessary
        getPosts((posts) => {
          const postIds = [];
          Object.entries(notificationsData).forEach(([postId, nItem]) => {
            postIds.push(postId);
            const post = posts[postId];
            if (typeof nItem === 'object' && post && post.room) {
              Object.entries(nItem).forEach(
                ([userId, notificationItemData]) => {
                  if (typeof notificationItemData === 'number') {
                    const timestamp = notificationItemData;
                    notifications.push({
                      postId,
                      room: post.room,
                      userId,
                      content: (
                        <NotificationItemLinkContent
                          timestamp={timestamp}
                          uid={userId}
                        />
                      ),
                      timestamp,
                    });
                  } else if (typeof notificationItemData === 'object') {
                    const { timestamp, type, uid } = notificationItemData;
                    notifications.push({
                      postId,
                      room: post.room, //TODO why is this here
                      userId,
                      content: (
                        <NotificationItemLinkContent
                          timestamp={timestamp}
                          uid={uid}
                          type={type}
                        />
                      ),
                      timestamp,
                      type,
                    });
                  }
                }
              );
            }
          });
          notifications.sort((a, b) => {
            return b.timestamp - a.timestamp;
          });
          this.setState({
            notifications: notifications,
            loading: false,
          });
          postIds && hackCleanupNotifications(this.user().uid, postIds); // make better
        });
      } else {
        this.setState({
          notifications: notifications,
          loading: false,
        });
      }
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
          <Popover>
            <Popover.Title as="h3">Notifications</Popover.Title>
            <Popover.Content>{Notifications}</Popover.Content>
          </Popover>
        }
      >
        <div>
          <NotificationBellIcon loading={this.state.loading}>
            {hasNotifications ? notifications.length : 0}
          </NotificationBellIcon>
        </div>
      </OverlayTrigger>
    );
  }
}
