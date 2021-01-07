import { statsByUserFromPosts } from './Stats';

describe('statsByUserFromPosts', () => {
  it('handles empty objects', () => {
    const posts = {};
    const users = {};
    expect(statsByUserFromPosts({ posts, users })).toEqual({});
  });
  it('works', () => {
    const posts = {
      1234: {
        tags: {
          1235: { type: 'abc', userId: '12345678' },
          1236: { type: 'asdf', userId: '23456789' },
        },
        userId: '12345678',
      },
      1237: {
        replyToId: '1234',
        userId: '23456789',
      },
      1238: {
        replyToId: '1234',
        userId: '12345678',
      },
    };
    const users = {
      '0987654321zyx': {
        displayName: 'user with no posts or anything',
      },
    };
    expect(statsByUserFromPosts({ posts, users })).toEqual({
      12345678: {
        postCount: 2,
        replyCount: 1,
        tags: 1,
        userId: '12345678',
      },
      23456789: {
        postCount: 1,
        replyCount: 1,
        tags: 1,
        userId: '23456789',
      },
      '0987654321zyx': {
        postCount: 0,
        replyCount: 0,
        tags: 0,
        userId: '0987654321zyx',
      },
    });
  });
});
