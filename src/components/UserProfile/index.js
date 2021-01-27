import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { AppContext } from '../AppProvider';
import UserPhoto from '../shared/UserPhoto';

const UserProfile = () => {
  const { user } = useContext(AppContext);
  return (
    <Card>
      <Card.Body>
        <UserPhoto uid={user.uid} />
        <Card.Title>{user.displayName}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default UserProfile;
