import { statsFromPostsAndUsers } from './Stats';

describe('statsByUserFromPosts', () => {
  it('handles empty objects', () => {
    const posts = {};
    const users = {};
    expect(statsFromPostsAndUsers({ posts, users })).toEqual({
      users: {},
      tags: {},
    });
  });
  it('works', () => {
    const posts = {
      1234: {
        tags: {
          1235: { type: 'abc', userId: '12345678' },
          1236: { type: 'asdf', userId: '23456789' },
        },
        userId: '12345678',
        upvote: {
          asdf: {},
          'jkl;': {},
        },
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
    expect(statsFromPostsAndUsers({ posts, users })).toEqual({
      users: {
        12345678: {
          postCount: 2,
          repliesReceivedNotSelf: 1,
          repliesSentNotSelf: 0,
          replyCount: 1,
          tags: 1,
          upvotes: 2,
          userId: '12345678',
        },
        23456789: {
          postCount: 1,
          repliesReceivedNotSelf: 0,
          repliesSentNotSelf: 1,
          replyCount: 1,
          tags: 1,
          upvotes: 0,
          userId: '23456789',
        },
        '0987654321zyx': {
          postCount: 0,
          repliesReceivedNotSelf: 0,
          repliesSentNotSelf: 0,
          replyCount: 0,
          tags: 0,
          upvotes: 0,
          userId: '0987654321zyx',
        },
      },
      tags: {
        abc: { type: 'abc', count: 1 },
        asdf: { type: 'asdf', count: 1 },
      },
    });
  });
});
