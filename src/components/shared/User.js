import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../AppProvider';

// TODO write tests for this
export const isPremium = ({ premium }) =>
  premium && premium.seconds && premium.seconds - Date.now() / 1000 > 0;

const PremiumIcon = ({ size }) => (
  <div
    style={{
      position: 'absolute',
      left: size / 48,
      top: 0,
      fontSize: size / 3,
    }}
    title="premium member supporting xbk.io"
  >
    &#11088; {/* white medium star emoji */}
  </div>
);

const PresenceIcon = ({ size }) => (
  <div
    style={{
      position: 'absolute',
      right: size / 48,
      bottom: 0,
      fontSize: size / 3,
    }}
    title="online"
  >
    &#128154; {/* green heart emoji */}
  </div>
);

export const UserPhoto = ({ size = 48, presence, uid }) => {
  const { users } = useContext(AppContext);
  if (!users) {
    console.warn('UserPhoto used before users context available');
    return null;
  }
  const user = users[uid];
  if (!user) {
    console.warn('UserPhoto unable to find uid in global users');
    return null;
  }
  return (
    <Link
      to={`/u/${user.uid}`}
      key={user.uid}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <img
        src={user.photoURL}
        alt="user"
        style={{ height: size, width: size }}
      />
      {isPremium({ premium: user.premium }) && <PremiumIcon size={size} />}
      {presence === 'online' && <PresenceIcon size={size} />}
    </Link>
  );
};

export const User = ({ children, displayName, size = 24, uid }) => {
  if (!uid) {
    console.error('User component requires value for uid');
  }

  let content = uid; //default
  if (children) {
    content = children; //priority
  } else if (uid && displayName) {
    content = (
      <>
        <UserPhoto uid={uid} size={size} />
        <span className="ml-1">{displayName}</span>
      </>
    );
  }

  return (
    <Link to={`/u/${uid}`} style={{ whiteSpace: 'nowrap' }}>
      {content}
    </Link>
  );
};
