import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import NewPostForm from './NewPostForm';
import { AppContext } from '../AppProvider';
import { createNewPost } from '../shared/db';
import UserPhoto from '../shared/UserPhoto';

const NewTopLevelPostCard = ({ hackRoom }) => {
  const { user } = useContext(AppContext);
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <UserPhoto uid={user.uid} />
          {user.displayName}
          <small className="text-muted ml-2">&#127757; Public</small>
        </Card.Title>
        <NewPostForm
          onSubmit={createNewPost}
          multiline={true}
          placeholder={'How are you really feeling?'}
          hackRoom={hackRoom}
        />
      </Card.Body>
    </Card>
  );
};

export default NewTopLevelPostCard;
