import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

const Stats = ({ posts }) => {
  const statsByUser = Object.keys(posts).reduce((result, key) => {
    const post = posts[key];
    const userId = post && post.userId;
    if (!result[userId]) {
      result[userId] = {
        userPhotoURL: post.userPhotoURL,
      };
    }
    const userStats = result[userId];
    if (userStats.hasOwnProperty('postCount')) {
      userStats.postCount++;
    } else {
      userStats.postCount = 1;
    }
    return result;
  }, {});

  const statsArrayByPostCount = Object.values(statsByUser).sort(
    (a, b) => b.postCount - a.postCount //descending
  );

  return (
    <Card>
      <Card.Body>
        <Card.Title>Top Posters</Card.Title>
        <Table borderless size="sm" style={{ fontSize: 24 }}>
          {/* <thead>
            <tr>
              <td></td>
              <td>Posts</td>
            </tr>
          </thead> */}
          <tbody>
            {statsArrayByPostCount.map((user) => {
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
                  <td>{user.postCount}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
export default Stats;
