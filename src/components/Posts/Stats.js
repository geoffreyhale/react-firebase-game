import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

const StatsTable = ({ title, statsByUser, statKey }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Table borderless size="sm" style={{ fontSize: 24 }}>
        <tbody>
          {Object.values(statsByUser)
            .sort(
              (a, b) => b[statKey] - a[statKey] //descending
            )
            .map((user) => {
              const userPhotoURL = user.userPhotoURL;
              return (
                <tr>
                  <td>
                    {userPhotoURL ? (
                      <img
                        src={userPhotoURL}
                        alt="user"
                        style={{ height: 38 }}
                      />
                    ) : null}
                  </td>
                  <td>{user[statKey]}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

const Stats = ({ posts }) => {
  const statsByUser = Object.keys(posts).reduce((result, key) => {
    const post = posts[key];
    const userId = post && post.userId;
    if (!result[userId]) {
      result[userId] = {
        userPhotoURL: post.userPhotoURL,
        postCount: 0,
        replyCount: 0,
      };
    }
    const userStats = result[userId];

    userStats.postCount++;

    if (post.replyToId) {
      userStats.replyCount++;
    }

    return result;
  }, {});

  return (
    <>
      <StatsTable
        title={'Top Repliers'}
        statsByUser={statsByUser}
        statKey={'replyCount'}
      />
      <StatsTable
        title={'Top Posters'}
        statsByUser={statsByUser}
        statKey={'postCount'}
      />
    </>
  );
};
export default Stats;
