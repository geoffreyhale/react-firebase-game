import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import NewPostForm from './NewPostForm';
import { AppContext } from '../AppProvider';
import { createPost } from '../../api/index';
import { UserPhoto } from '../shared/User';
import { PostHeaderRoom } from './Post';

const NewTopLevelPostCard = ({ hackRoom }) => {
  const { user } = useContext(AppContext);
  const hackHackRoom = hackRoom || 'general';
  return (
    <Card>
      <Card.Body>
        {!hackRoom && (
          <div className="float-right">
            <small className="text-muted">to: </small>
            <PostHeaderRoom room={hackHackRoom} />
          </div>
        )}
        <Card.Title>
          <UserPhoto uid={user.uid} />
          <span className="ml-2">{user.displayName}</span>
          <small className="text-muted ml-2">&#127757; Public</small>
        </Card.Title>
        <NewPostForm
          onSubmit={createPost}
          multiline={true}
          placeholder={'How are you really feeling?'}
          hackRoom={hackHackRoom}
        />
      </Card.Body>
    </Card>
  );
};

export default NewTopLevelPostCard;
