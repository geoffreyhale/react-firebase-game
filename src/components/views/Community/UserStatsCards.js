import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { UserProfilePhotoBanner } from '../UserProfile';
import { getScoresByUid, UserScoreListGroup } from '../UserProfile/UserStats';
import { AppContext } from '../../AppProvider';
import { getPosts } from '../../../api';

//TODO sort by Score please
const UserStatsCards = () => {
  const { users } = useContext(AppContext);
  const [scores, setScores] = useState({});

  useEffect(() => {
    getPosts((posts) => {
      setScores(getScoresByUid({ uids: Object.keys(users), posts }));
    });
  }, []);

  return (
    <Card>
      <Card.Body>
        {Object.entries(scores)
          .sort(([aKey, a], [bKey, b]) => {
            return a.score < b.score ? 1 : -1;
          })
          .map(([uid, score]) => (
            // width here is a hack for UserProfilePhotoBanner Card.Img objectFit: 'cover' blowing up based on src img width
            <div
              key={uid}
              className="m-2"
              style={{ display: 'inline-block', width: 300 }}
            >
              <UserProfilePhotoBanner user={users[uid]} />
              <UserScoreListGroup scores={score} />
            </div>
          ))}
      </Card.Body>
    </Card>
  );
};

export default UserStatsCards;
