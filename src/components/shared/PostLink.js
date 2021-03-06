import React from 'react';
import { Link } from 'react-router-dom';

export const postLink = ({ id, room }, includeHost = false) =>
  `${includeHost ? window.location.host : ''}/r/${room}/posts/${id}`;

const PostLink = ({ children, id, room }) => (
  <Link to={postLink({ id, room })}>{children}</Link>
);
export default PostLink;
