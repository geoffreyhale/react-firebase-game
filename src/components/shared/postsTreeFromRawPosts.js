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
const postsTreeFromRawPosts = ({ flatPostsArray = [], users = {} }) => {
  const postsByTimestamp = {};
  flatPostsArray.forEach((post) => {
    if (users) {
      post.userDisplayName =
        (users[post.userId] && users[post.userId].displayName) || 'Loading...';
      post.userPhotoURL =
        (users[post.userId] && users[post.userId].photoURL) || null;
    }

    postsByTimestamp[post.timestamp] = post;
  });

  // TODO use hotScore
  // TODO write tests
  const pseudoHotSortPosts = Object.keys(postsByTimestamp)
    .sort((aTimestamp, bTimestamp) => {
      const postA = postsByTimestamp[aTimestamp];
      const postB = postsByTimestamp[bTimestamp];
      const aUpvotes = postA.upvote;
      const bUpvotes = postB.upvote;
      if (!aUpvotes) {
        return 1;
      }
      if (!bUpvotes) {
        return -1;
      }
      const aUpvotesCount = Object.keys(aUpvotes).length;
      const bUpvotesCount = Object.keys(bUpvotes).length;
      if (bUpvotesCount - aUpvotesCount) {
        // TODO this isn't doing anything, I don't know why
        return aTimestamp < bTimestamp ? -1 : 1;
      }
      return bUpvotesCount - aUpvotesCount;
    })
    .reduce((result, key) => {
      result[key] = postsByTimestamp[key];
      return result;
    }, {});

  const postsTreeWithReplies = createDataTree(
    Object.values(pseudoHotSortPosts)
  );

  // TODO don't handle this sort here
  const postsTreeReverseChronological = postsTreeWithReplies.sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return postsTreeReverseChronological;
};

export default postsTreeFromRawPosts;
