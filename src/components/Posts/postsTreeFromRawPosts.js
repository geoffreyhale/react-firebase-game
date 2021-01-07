//TODO write tests for this function
//adapted from https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript
export const createDataTree = (dataset) => {
  const hashTable = Object.create(null);
  dataset.forEach(
    (aData) => (hashTable[aData.id] = { ...aData, childNodes: [] })
  );
  const dataTree = [];
  dataset.forEach((aData) => {
    if (aData.replyToId && hashTable[aData.replyToId]) {
      hashTable[aData.replyToId].childNodes.push(hashTable[aData.id]);
    } else {
      dataTree.push(hashTable[aData.id]);
    }
  });
  return dataTree;
};

//TODO write tests for this function
const postsTreeFromRawPosts = ({ posts, users }) => {
  const postsByTimestamp = {};
  Object.keys(posts).forEach((postId) => {
    const post = posts[postId];
    post.id = postId;
    post.userDisplayName =
      (users[post.userId] && users[post.userId].displayName) ||
      'USER NAME NOT FOUND';
    post.userPhotoURL =
      (users[post.userId] && users[post.userId].photoURL) || null;
    postsByTimestamp[post.timestamp] = post;
  });
  const postsChronological = Object.keys(postsByTimestamp)
    .sort((a, b) => a - b)
    .reduce((result, key) => {
      result[key] = postsByTimestamp[key];
      return result;
    }, {});
  const postsTreeWithReplies = createDataTree(
    Object.values(postsChronological)
  );
  const postsTreeReverseChronological = postsTreeWithReplies.sort(
    (a, b) => b.timestamp - a.timestamp
  );
  return postsTreeReverseChronological;
};

export default postsTreeFromRawPosts;
