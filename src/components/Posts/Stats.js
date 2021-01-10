import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Tag from './Tag';

// TODO refactor: build stats.users etc object first, then iterate posts
export const statsFromPostsAndUsers = ({ posts, users }) => {
  const result = { users: {}, tags: {} };

  users &&
    Object.entries(users).forEach(([i, user]) => {
      result.users[i] = {
        userId: i,
        postCount: 0,
        repliesReceivedNotSelf: 0,
        repliesSentNotSelf: 0,
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
        repliesReceivedNotSelf: 0,
        repliesSentNotSelf: 0,
        replyCount: 0,
        tags: 0,
      };
    }

    // Posts (includes Replies)
    result.users[userId].postCount++;

    // Replies
    if (post.replyToId) {
      result.users[userId].replyCount++;

      // reply not to self
      const parentPostUserId = posts[post.replyToId].userId;
      if (parentPostUserId !== userId) {
        result.users[userId].repliesSentNotSelf++;
        result.users[parentPostUserId].repliesReceivedNotSelf++;
      }
    }

    // Tags
    if (post.tags) {
      Object.values(post.tags).forEach((tag) => {
        if (tag) {
          // if tag is not yet in results, add it
          if (!result.tags[tag.type]) {
            result.tags[tag.type] = {
              type: tag.type,
              count: 1,
            };
          } else {
            result.tags[tag.type].count++;
          }

          if (tag.userId) {
            // if user missing from users! add user for stats
            if (tag.userId && !result.users[tag.userId]) {
              result.users[tag.userId] = {
                userId: tag.userId,
                postCount: 0,
                repliesReceivedNotSelf: 0,
                repliesSentNotSelf: 0,
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

const TagStatsTable = ({ title, subtitle, statsByTag }) => (
  <Card className="mb-2 tag-stats">
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
      <Table borderless size="sm">
        <tbody>
          {Object.values(statsByTag)
            .sort(
              //descending by count then alphabetical
              (a, b) => {
                return b.count === a.count
                  ? a.type.localeCompare(b.type)
                  : b.count - a.count;
              }
            )
            .map((tag) => {
              return (
                <tr key={tag.type}>
                  <td>
                    <Tag>{tag.type}</Tag>
                  </td>
                  <td>{tag.count}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

const StatsTable = ({ title, subtitle, footer, statsByUser, statKey }) => (
  <Card className="mb-2 user-stats">
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
            .filter((user) => user[statKey] > 0)
            .sort(
              (a, b) => b[statKey] - a[statKey] //descending
            )
            .map((user) => {
              const userPhotoURL = user.userPhotoURL;
              return (
                <tr key={Math.random()}>
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
      {footer ? <small className="text-muted">{footer}</small> : null}
    </Card.Body>
  </Card>
);

const Stats = ({ posts, users }) => {
  if (!posts || !users) {
    return null;
  }

  const stats = statsFromPostsAndUsers({ posts, users });
  const statsByUser = stats.users;
  const statsByTag = stats.tags;

  Object.keys(statsByUser).forEach((key) => {
    statsByUser[key].userPhotoURL =
      users[statsByUser[key].userId] && users[statsByUser[key].userId].photoURL;
  });

  return (
    <>
      <StatsTable
        title={'Most Replies Received'}
        subtitle={'Conversation Starters'}
        statsByUser={statsByUser}
        statKey={'repliesReceivedNotSelf'}
        key={'top-replies-received'}
        footer={'Does not include replies to your own posts.'}
      />
      {/* TODO "First Responders" */}
      <StatsTable
        title={'Top Repliers'}
        subtitle={'Conversationalists'}
        statsByUser={statsByUser}
        statKey={'repliesSentNotSelf'}
        key={'top-repliers'}
        footer={'Does not include replies to your own posts.'}
      />
      <StatsTable
        title={'Top Posters'}
        statsByUser={statsByUser}
        statKey={'postCount'}
        key={'top-posters'}
        footer={'Includes posts and replies.'}
      />
      <StatsTable
        title={'Top Taggers'}
        statsByUser={statsByUser}
        statKey={'tags'}
        key={'top-taggers'}
        footer={'Includes tags on your own posts.'}
      />
      <TagStatsTable title={'Top Tags'} statsByTag={statsByTag} key={'tags'} />
    </>
  );
};
export default Stats;
