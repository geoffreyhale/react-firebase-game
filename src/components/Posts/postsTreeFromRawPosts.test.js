import postsTreeFromRawPosts, { createDataTree } from './Stats';

describe('postsTreeFromRawPosts', () => {
  it('handles empty objects', () => {
    const posts = {};
    const users = {};
    expect(postsTreeFromRawPosts({ posts, users })).toEqual({});
  });
});
