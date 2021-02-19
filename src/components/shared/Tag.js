import React, { useContext, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { removeTag } from '../../api';
import { AppContext } from '../AppProvider';

import './tag.css';

const Tag = ({ allowDelete = false, children, variant, postId }) => {
  const [showDelete, setShowDelete] = useState(false);
  const { user } = useContext(AppContext);

  if (allowDelete && postId && children && user.uid) {
    return (
      <div className="badge-group" onMouseLeave={() => setShowDelete(false)}>
        <Badge
          pill
          variant={variant || 'secondary'}
          onMouseEnter={() => setShowDelete(true)}
        >
          {children}
        </Badge>
        {showDelete && (
          <Badge
            pill
            variant={'danger'}
            onClick={() => {
              removeTag({ postId, content: children, uid: user.uid });
            }}
          >
            x
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Badge pill variant={variant || 'secondary'}>
      {children}
    </Badge>
  );
};

export default Tag;
