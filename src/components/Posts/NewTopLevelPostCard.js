import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import NewPostForm from './NewPostForm';
import { AppContext } from '../AppProvider';

const NewTopLevelPostCard = ({ createNewPost }) => {
  const { user } = useContext(AppContext);
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {user.photoURL ? (
            <img src={user.photoURL} alt="user" style={{ height: 48 }} />
          ) : null}
          {user.displayName}
          <small className="text-muted ml-2">&#127757; Public</small>
        </Card.Title>
        <NewPostForm onSubmit={createNewPost} multiline={true} />
      </Card.Body>
    </Card>
  );
};

export default NewTopLevelPostCard;
