import format from 'date-fns/format';
import React from 'react';
import Table from 'react-bootstrap/Table';
import countWords from '../../shared/countWords';
import PostLink from '../../shared/PostLink';

const dateFromDaysSinceEpoch = (days) => {
  return new Date(days * 1000 * 86400);
};

const daysSinceEpoch = (timestamp) => {
  return Math.floor(timestamp / 1000 / 86400);
};

const pushReplyCountWordCountObjects = (
  post,
  replyCountByWordCountObjectsArray
) => {
  if (post.childNodes?.length > 0) {
    post.childNodes.forEach((post) =>
      pushReplyCountWordCountObjects(post, replyCountByWordCountObjectsArray)
    );
  }
  if (post.content) {
    const replyCount = post.childNodes?.length || 0;
    const wordCount = countWords(post.content);
    // if (replyCount !== 0 && wordCount !== 0) {
    const replyCountByWordCountObject = {
      replyCount,
      wordCount,
    };
    replyCountByWordCountObjectsArray.push(replyCountByWordCountObject);
    // }
  }
};

export const PostsMiniCard = ({ posts }) => {
  Object.keys(posts).map((key) => {
    posts[key].id = key;
  });

  const count = Object.keys(posts).length;
  const postsWithNoRoom = Object.values(posts).filter((post) => !post.room);
  const postsDeleted = Object.values(posts).filter(
    (post) => post.deleted === true
  );
  const postsDeletedWithNoReplies = postsDeleted.filter((post) => {
    return !Object.values(posts).some((p) => p.replyToId === post.id);
  });

  return (
    <>
      <div>
        <strong>Total:</strong> {count}
      </div>
      <div title="posts w undefined room">
        <strong>Room Orphans:</strong> {postsWithNoRoom.length}
      </div>
      {postsWithNoRoom.map((post) => (
        <div>id: {post.id}</div>
      ))}
      <div>
        <strong>Deleted:</strong> {postsDeleted.length}
      </div>
      <div>
        <strong title="deleted w no replies">Removable:</strong>{' '}
        {postsDeletedWithNoReplies.length}
      </div>
      {postsDeletedWithNoReplies.map((post) => (
        <div>
          id:{' '}
          <PostLink id={post.id} room={post.room}>
            {post.id}
          </PostLink>
        </div>
      ))}
    </>
  );
};

export const PostsPerDay = ({ posts }) => {
  const postsByDay = {};

  Object.values(posts).forEach((post) => {
    const day = daysSinceEpoch(post.timestamp);
    postsByDay[day] = postsByDay[day] || {};
    postsByDay[day][post.id] = post;
  });

  return (
    <Table>
      <tbody>
        {Object.entries(postsByDay).map(([daysSinceEpoch, posts]) => (
          <tr>
            <td>
              {format(dateFromDaysSinceEpoch(daysSinceEpoch), 'MMMM d, yyyy')}{' '}
            </td>
            <td>{Object.keys(posts).length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
