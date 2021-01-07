import React from 'react';
import Badge from 'react-bootstrap/Badge';

const Tag = ({ type, variant }) => {
  return (
    <Badge pill variant={variant || 'secondary'}>
      {type}
    </Badge>
  );
};

export default Tag;
