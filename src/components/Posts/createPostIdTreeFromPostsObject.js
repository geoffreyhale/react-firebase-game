export const createSortedArrayFromObjectWithIdFromKey = (
  posts,
  sortKey = 'timestamp'
) => {
  return Object.entries(posts)
    .map(([key, value]) => ({ id: key, ...value }))
    .sort((a, b) => a[sortKey] - b[sortKey]);
};

export const createTreeFromSortedArray = (array, link = 'parentId') => {
  const hash = Object.create(null);
  array.forEach((a) => (hash[a.id] = { ...a, childNodes: [] }));
  const dataTree = [];
  array.forEach((a) => {
    if (a[link] && hash[a[link]]) {
      hash[a[link]].childNodes.push(hash[a.id]);
    } else {
      dataTree.push(hash[a.id]);
    }
  });
  return dataTree;
};

const createPostIdTreeFromPostsObject = (postsObject) =>
  createTreeFromSortedArray(
    createSortedArrayFromObjectWithIdFromKey(postsObject),
    'replyToId'
  );

export default createPostIdTreeFromPostsObject;
