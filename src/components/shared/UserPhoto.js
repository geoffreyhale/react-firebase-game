import React, { useContext } from 'react';
import { AppContext } from '../AppProvider';

// TODO write tests for this
const isPremium = ({ premium }) =>
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

const UserPhoto = ({ size = 48, presence, key, uid }) => {
  const { users } = useContext(AppContext);
  if (!users) {
    console.error('UserPhoto used before users context available');
    return null;
  }
  const user = users[uid];
  if (!user) {
    console.error('UserPhoto unable to find uid in global users');
    return null;
  }
  return (
    <div
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
    </div>
  );
};

export default UserPhoto;
