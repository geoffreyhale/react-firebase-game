import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import NewPostForm from './NewPostForm';
import { AppContext } from '../../AppProvider';
import { createPost } from '../../../api/index';
import { UserPhoto } from '../../shared/User';
import { premiumRooms } from '../Rooms/getROOMS';
import MyDropdownToggle from '../../shared/MyDropdownToggle';

const RoomSelect = ({ room, setRoom, hackHideRoomSelectDropdown }) => {
  const { rooms, user } = useContext(AppContext);
  return (
    <div style={{ display: 'inline-block' }}>
      <Dropdown>
        <Link to={`/r/${room}`}>r/{room}</Link>
        {!hackHideRoomSelectDropdown && (
          <>
            <MyDropdownToggle />
            <Dropdown.Menu>
              {Object.values(rooms)
                // TODO functionize this filter as userValidRooms
                .filter(
                  (room) =>
                    room.id !== 'home' &&
                    !room.hidden &&
                    (user.isPremium ||
                      !room.requires ||
                      !room.requires.includes('premium'))
                )
                .map((room) => {
                  if (room.id === 'home') return;
                  return (
                    <Dropdown.Item
                      key={room.id}
                      onClick={() => setRoom(room.id)}
                    >
                      {room.title}
                    </Dropdown.Item>
                  );
                })}
            </Dropdown.Menu>
          </>
        )}
      </Dropdown>
    </div>
  );
};

const VISIBILITIES = Object.freeze({
  logged: 'Logged In Users',
  premium: 'Premium Users',
});

const Visibility = ({ room }) => {
  const { rooms } = useContext(AppContext);
  if (!rooms || !premiumRooms(rooms)) return null;
  const visibility = premiumRooms(rooms).includes(room)
    ? VISIBILITIES['premium']
    : VISIBILITIES['logged'];
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip>Visibility: {visibility}</Tooltip>}
    >
      <span>
        {visibility === VISIBILITIES['logged'] && (
          <FontAwesomeIcon icon={faUserCheck} />
        )}
        {visibility === VISIBILITIES['premium'] && <>&#11088;</>}
      </span>
    </OverlayTrigger>
  );
};

const NewTopLevelPostCard = ({
  hackRoom,
  onSuccess,
  navigateOnModalitySelect = false,
}) => {
  const { user } = useContext(AppContext);
  const hackHackRoom = !hackRoom || hackRoom === 'home' ? 'general' : hackRoom;
  const hackHideRoomSelectDropdown = hackRoom && hackRoom !== 'home';
  const [room, setRoom] = useState(hackHackRoom);
  return (
    <Card>
      <Card.Body>
        <div className="mb-2">
          <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
            <UserPhoto uid={user.uid} />
          </div>
          <div className="ml-2" style={{ display: 'inline-block' }}>
            <div>
              <strong style={{ fontWeight: 600 }}>{user.displayName}</strong>
              <span className="text-muted">
                {room && (
                  <>
                    {' '}
                    &#8250;{' '}
                    <RoomSelect
                      room={room}
                      setRoom={setRoom}
                      hackHideRoomSelectDropdown={hackHideRoomSelectDropdown}
                    />
                  </>
                )}
                <span className="ml-2">
                  <Visibility key={room} room={room} />
                </span>
              </span>
            </div>
          </div>
        </div>
        <NewPostForm
          onSubmit={createPost}
          multiline={true}
          placeholder={'How are you really feeling?'}
          hackRoom={room}
          onSuccess={() =>
            onSuccess && typeof onSuccess === 'function' && onSuccess({ room })
          }
          navigateOnModalitySelect={navigateOnModalitySelect}
        />
      </Card.Body>
    </Card>
  );
};

export default NewTopLevelPostCard;
