import React from 'react';
import { Link } from 'react-router-dom';

export const User = ({ displayName, uid, children }) => (
  <Link to={`/u/${uid}`}>{children || displayName || uid}</Link>
);
