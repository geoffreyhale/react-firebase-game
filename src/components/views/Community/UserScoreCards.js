import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { getPosts } from '../../../api';
import { AppContext } from '../../AppProvider';
import { UserProfilePhotoBanner } from '../UserProfile';
import { getScoresByUid, UserScoreListGroup } from '../UserProfile/UserStats';

//TODO sort by Score please
const UserScoreCards = () => {
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

export default UserScoreCards;
