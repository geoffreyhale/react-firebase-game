import React from 'react';
import { Link } from 'react-router-dom';
import UserPhoto from './UserPhoto';

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
