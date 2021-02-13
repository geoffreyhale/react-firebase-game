import React from 'react';
import Card from 'react-bootstrap/Card';
import countWords from '../../shared/countWords';
import PostLink from '../../shared/PostLink';

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

const Posts = ({ posts }) => {
  Object.keys(posts).map((key) => {
    posts[key].id = key;
  });

  const count = Object.keys(posts).length;
  const postsWithNoRoom = Object.values(posts).filter((post) => !post.room);
  const postsDeleted = Object.values(posts).filter(
    (post) => post.deleted === true
  );
  const postsDeletedWithNoReplies = postsDeleted.filter((post) => {
    return !Object.values(posts).includes((post) => post.replyToId === post.id);
  });

  return (
    <Card>
      <Card.Body>
        <Card.Title>Posts</Card.Title>
        <div>total posts count: {count}</div>
        <div>orphans (undefined room): {postsWithNoRoom.length}</div>
        {postsWithNoRoom.map((post) => (
          <div>id: {post.id}</div>
        ))}
        <div>deleted: {postsDeleted.length}</div>
        <div>
          deleted w no replies (removable): {postsDeletedWithNoReplies.length}
        </div>
        {postsDeletedWithNoReplies.map((post) => (
          <div>
            id:{' '}
            <PostLink id={post.id} room={post.room}>
              {post.id}
            </PostLink>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default Posts;
