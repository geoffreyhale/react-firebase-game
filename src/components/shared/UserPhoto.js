import React from 'react';

const UserPhoto = ({ src, size = 48 }) => (
  <img src={src} alt="user" style={{ height: size }} />
);
export default UserPhoto;
