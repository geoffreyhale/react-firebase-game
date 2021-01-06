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

  const statsArrayByPostCount = Object.values(statsByUser).sort(
    (a, b) => b.postCount - a.postCount //descending
  );
  const statsArrayByReplyCount = Object.values(statsByUser).sort(
    (a, b) => b.replyCount - a.replyCount //descending
  );

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Top Repliers</Card.Title>
          <Table borderless size="sm" style={{ fontSize: 24 }}>
            <tbody>
              {statsArrayByReplyCount.map((user) => {
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
                    <td>{user.replyCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Top Posters</Card.Title>
          <Table borderless size="sm" style={{ fontSize: 24 }}>
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
    </>
  );
};
export default Stats;
