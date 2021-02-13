import React from 'react';
import { Link } from 'react-router-dom';

const PostLink = ({ children, id, room }) => (
  <Link to={`/r/${room}/posts/${id}`}>{children}</Link>
);
export default PostLink;
