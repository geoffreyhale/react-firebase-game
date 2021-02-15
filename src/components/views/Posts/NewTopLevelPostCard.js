import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import NewPostForm from './NewPostForm';
import { AppContext } from '../../AppProvider';
import { createPost } from '../../../api/index';
import { UserPhoto } from '../../shared/User';
import { PostHeaderRoom } from './Post';

const Visibility = ({ postingToRoom }) => (
  <OverlayTrigger
    placement="right"
    overlay={<Tooltip>Visibility: Logged In Users</Tooltip>}
  >
    <small className="text-muted">
      {postingToRoom && (
        <span className="mr-2">
          <Link to={`r/${postingToRoom}`}>r/{postingToRoom}</Link>
        </span>
      )}
      <i class="fas fa-user-check"></i>
    </small>
  </OverlayTrigger>
);

const NewTopLevelPostCard = ({ hackRoom }) => {
  const { user } = useContext(AppContext);
  const hackHackRoom = hackRoom === 'home' ? 'general' : hackRoom;
  return (
    <Card>
      <Card.Body>
        {!hackRoom && (
          <div className="float-right">
            <small className="text-muted">to: </small>
            <PostHeaderRoom room={hackHackRoom} />
          </div>
        )}
        <div>
          <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
            <UserPhoto uid={user.uid} />
          </div>
          <div className="ml-2" style={{ display: 'inline-block' }}>
            <h5 style={{ marginBottom: 0 }}>{user.displayName}</h5>
            <div>
              <Visibility postingToRoom={hackHackRoom} />
            </div>
          </div>
        </div>
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
