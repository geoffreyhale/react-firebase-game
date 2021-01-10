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

const shouldLowPriority = (post) => {
  // is old
  const duration = intervalToDuration({
    start: new Date(post.timestamp),
    end: new Date(),
  });

  const isOld = duration.years || duration.months || duration.days > 7;
  if (isOld) {
    return true;
  }

  return false;
};

//TODO write tests for this function
const postsTreeFromRawPosts = ({ flatPostsArray, users }) => {
  const postsByTimestamp = {};
  let countLowPriorityPosts = 0;

  flatPostsArray.forEach((post) => {
    post.userDisplayName =
      (users[post.userId] && users[post.userId].displayName) || 'Loading...';
    post.userPhotoURL =
      (users[post.userId] && users[post.userId].photoURL) || null;
    if (shouldLowPriority(post)) {
      post.lowPriority = true;
      countLowPriorityPosts++;
    }

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
    data: { countLowPriorityPosts },
  };
};

export default postsTreeFromRawPosts;
