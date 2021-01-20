import React from 'react';

const PremiumIcon = ({ size }) => (
  <div
    style={{
      position: 'absolute',
      left: size / 48,
      top: 0,
      fontSize: size / 3,
    }}
    title="premium"
  >
    &#11088; {/* white medium star, emoji */}
  </div>
);

const UserPhoto = ({ src, size = 48, premium = false }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img src={src} alt="user" style={{ height: size }} />
      {premium && <PremiumIcon size={size} />}
    </div>
  );
};
export default UserPhoto;
