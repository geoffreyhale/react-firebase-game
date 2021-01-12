import React from 'react';
import Card from 'react-bootstrap/Card';
import NewPostForm from './NewPostForm';

const NewTopLevelPostCard = ({ photoURL, displayName, createNewPost }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {photoURL ? (
            <img src={photoURL} alt="user" style={{ height: 48 }} />
          ) : null}
          {displayName}
          <small className="text-muted ml-2">&#127757; Public</small>
        </Card.Title>
        <NewPostForm onSubmit={createNewPost} multiline={true} />
      </Card.Body>
    </Card>
  );
};

export default NewTopLevelPostCard;
