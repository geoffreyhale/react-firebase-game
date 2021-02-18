import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { UserProfilePhotoBanner } from '../UserProfile';
import UserStats from '../UserProfile/UserStats';
import { AppContext } from '../../AppProvider';

//TODO sort by Score please
const UserStatsCards = () => {
  const { user, users } = useContext(AppContext);
  return (
    <Card>
      <Card.Body>
        {Object.values(users)
          .sort((a, b) => (a.uid === user.uid ? -1 : 0))
          .map((user) => (
            // width here is a hack for UserProfilePhotoBanner Card.Img objectFit: 'cover' blowing up based on src img width
            <div
              className="m-2"
              style={{ display: 'inline-block', width: 300 }}
            >
              <UserProfilePhotoBanner user={user} />
              <UserStats uid={user.uid} />
            </div>
          ))}
      </Card.Body>
    </Card>
  );
};

export default UserStatsCards;
