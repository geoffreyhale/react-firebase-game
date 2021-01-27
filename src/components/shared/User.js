import React from 'react';
import { Link } from 'react-router-dom';

export const User = ({ uid, children }) => (
  <Link to={`/u/${uid}`}>{children || uid}</Link>
);
