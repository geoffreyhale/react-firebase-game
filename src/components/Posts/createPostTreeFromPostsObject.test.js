import createPostTreeFromPostsObject, {
  createSortedArrayFromObjectWithIdFromKey,
  createTreeFromSortedArray,
} from './createPostTreeFromPostsObject';

const posts = {
  '0006': {
    timestamp: 7,
    replyToId: '9999',
  },
  '0000': {
    timestamp: 1,
  },
  '0001': {
    timestamp: 2,
    replyToId: '0000',
  },
  '0002': {
    timestamp: 3,
    replyToId: '0001',
  },
  '0003': {
    timestamp: 4,
    replyToId: '0000',
  },
  '0004': {
    timestamp: 5,
    replyToId: '0001',
  },
  '0005': {
    timestamp: 6,
  },
};

const postsArrayWithIdsExpectedResult = [
  { id: '0000', timestamp: 1 },
  { id: '0001', replyToId: '0000', timestamp: 2 },
  { id: '0002', replyToId: '0001', timestamp: 3 },
  { id: '0003', replyToId: '0000', timestamp: 4 },
  { id: '0004', replyToId: '0001', timestamp: 5 },
  { id: '0005', timestamp: 6 },
  { id: '0006', replyToId: '9999', timestamp: 7 },
];

const treeFromPostsExpectedResult = [
  {
    childNodes: [
      {
        childNodes: [
          { childNodes: [], id: '0002', replyToId: '0001', timestamp: 3 },
          { childNodes: [], id: '0004', replyToId: '0001', timestamp: 5 },
        ],
        id: '0001',
        replyToId: '0000',
        timestamp: 2,
      },
      { childNodes: [], id: '0003', replyToId: '0000', timestamp: 4 },
    ],
    id: '0000',
    timestamp: 1,
  },
  { childNodes: [], id: '0005', timestamp: 6 },
  { childNodes: [], id: '0006', replyToId: '9999', timestamp: 7 },
];

describe('createArrayFromObjectWithIdFromKey', () => {
  it('works', () => {
    expect(createSortedArrayFromObjectWithIdFromKey(posts)).toEqual(
      postsArrayWithIdsExpectedResult
    );
  });
});

describe('createTree', () => {
  it('works', () => {
    expect(
      createTreeFromSortedArray(postsArrayWithIdsExpectedResult, 'replyToId')
    ).toEqual(treeFromPostsExpectedResult);
  });
});

describe('createPostTreeFromPostsObject', () => {
  it('works', () => {
    expect(createPostTreeFromPostsObject(posts)).toEqual(
      treeFromPostsExpectedResult
    );
  });
});
