import intervalToDuration from 'date-fns/intervalToDuration';

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
const postsTreeFromRawPosts = ({ flatPostsArray, users }) => {
  const postsByTimestamp = {};
  flatPostsArray.forEach((post) => {
    post.userDisplayName =
      (users[post.userId] && users[post.userId].displayName) || 'Loading...';
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

  return {
    posts: postsTreeReverseChronological,
  };
};

export default postsTreeFromRawPosts;
