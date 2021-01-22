import React from 'react';
import Badge from 'react-bootstrap/Badge';

const Tag = ({ children, variant }) => {
  return (
    <Badge pill variant={variant || 'secondary'}>
      {children}
    </Badge>
  );
};

export default Tag;
