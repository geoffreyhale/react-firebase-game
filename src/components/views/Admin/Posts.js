import React from 'react';
import Card from 'react-bootstrap/Card';
import countWords from '../../shared/countWords';
import postsTreeFromRawPosts from '../../shared/postsTreeFromRawPosts';
// import MyScatterPlot from './MyScatterPlot';

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

  // const replyCountByWordCountObjectsArray = [];
  // const postsTree = postsTreeFromRawPosts({
  //   flatPostsArray: Object.values(posts),
  //   // users,
  // });
  // pushReplyCountWordCountObjects(
  //   { childNodes: postsTree.posts },
  //   replyCountByWordCountObjectsArray
  // );
  //
  // const dataForScatterPlot = [
  //   {
  //     id: 'reply count per word count',
  //     data: replyCountByWordCountObjectsArray.map((data) => ({
  //       x: data.wordCount,
  //       y: data.replyCount,
  //     })),
  //   },
  // ];

  return (
    <Card>
      <Card.Body>
        <Card.Title>Posts</Card.Title>
        <div>count: {count}</div>
        <div>orphans (undefined room): {postsWithNoRoom.length}</div>
        {postsWithNoRoom.map((post) => (
          <div>id: {post.id}</div>
        ))}
        {/* <MyScatterPlot data={dataForScatterPlot} /> */}
      </Card.Body>
    </Card>
  );
};

export default Posts;
