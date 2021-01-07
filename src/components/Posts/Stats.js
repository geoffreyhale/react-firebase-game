import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

export const statsByUserFromPosts = (posts) =>
  Object.keys(posts).reduce((result, key) => {
    const post = posts[key];
    const userId = post && post.userId;
    if (!result[userId]) {
      result[userId] = {
        userId: userId,
        postCount: 0,
        replyCount: 0,
        tags: 0,
      };
    }
    const userStats = result[userId];

    // Posts (includes Replies)
    userStats.postCount++;

    // Replies
    if (post.replyToId) {
      userStats.replyCount++;
    }

    // Tags
    if (post.tags) {
      Object.values(post.tags).forEach((tag) => {
        if (!tag || !tag.userId) {
          return;
        }
        if (tag.userId && !result[tag.userId]) {
          result[tag.userId] = {
            userId: tag.userId,
            postCount: 0,
            replyCount: 0,
            tags: 0,
          };
        }
        result[tag.userId].tags++;
      });
    }

    return result;
  }, {});

const StatsTable = ({ title, statsByUser, statKey }) => (
  <Card className="mb-2">
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

const Stats = ({ posts, users }) => {
  const statsByUser = statsByUserFromPosts(posts);

  Object.keys(statsByUser).forEach((key) => {
    statsByUser[key].userPhotoURL = users[statsByUser[key].userId].photoURL;
  });

  return (
    <>
      <StatsTable
        title={'Top Repliers'}
        statsByUser={statsByUser}
        statKey={'replyCount'}
        key={'replyCount'}
      />
      <StatsTable
        title={'Top Posters'}
        statsByUser={statsByUser}
        statKey={'postCount'}
        key={'postCount'}
      />
      <StatsTable
        title={'Top Taggers'}
        statsByUser={statsByUser}
        statKey={'tags'}
        key={'tags'}
      />
    </>
  );
};
export default Stats;
