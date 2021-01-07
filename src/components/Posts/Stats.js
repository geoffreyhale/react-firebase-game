import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

export const statsFromPostsAndUsers = ({ posts, users }) => {
  const result = { users: {}, tags: {} };

  users &&
    Object.entries(users).forEach(([i, user]) => {
      result.users[i] = {
        userId: i,
        postCount: 0,
        replyCount: 0,
        tags: 0,
      };
    });

  Object.values(posts).forEach((post) => {
    const userId = post && post.userId;

    // if user missing from users! add user for stats
    if (!result.users[userId]) {
      result.users[userId] = {
        userId: userId,
        postCount: 0,
        replyCount: 0,
        tags: 0,
      };
    }

    // Posts (includes Replies)
    result.users[userId].postCount++;

    // Replies
    if (post.replyToId) {
      result.users[userId].replyCount++;
    }

    // Tags
    if (post.tags) {
      Object.values(post.tags).forEach((tag) => {
        if (tag) {
          // if tag is not yet in results, add it
          if (!result.tags[tag.type]) {
            result.tags[tag.type] = 1;
          } else {
            result.tags[tag.type]++;
          }

          if (tag.userId) {
            // if user missing from users! add user for stats
            if (tag.userId && !result.users[tag.userId]) {
              result.users[tag.userId] = {
                userId: tag.userId,
                postCount: 0,
                replyCount: 0,
                tags: 0,
              };
            }
            result.users[tag.userId].tags++;
          }
        }
      });
    }
  });

  return result;
};

const StatsTable = ({ title, subtitle, statsByUser, statKey }) => (
  <Card className="mb-2">
    <Card.Body>
      <Card.Title>
        {title}
        {subtitle && (
          <>
            <br />
            <small className="text-muted">{subtitle}</small>
          </>
        )}
      </Card.Title>
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
  if (!posts || !users) {
    return null;
  }

  const stats = statsFromPostsAndUsers({ posts, users });
  const statsByUser = stats.users;

  Object.keys(statsByUser).forEach((key) => {
    statsByUser[key].userPhotoURL = users[statsByUser[key].userId].photoURL;
  });

  return (
    <>
      <StatsTable
        title={'Top Repliers'}
        subtitle={'Conversationalists'}
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
