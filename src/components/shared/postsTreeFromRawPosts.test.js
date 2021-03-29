import postsTreeFromRawPosts from './postsTreeFromRawPosts';

describe('postsTreeFromRawPosts', () => {
  it('handles empty objects', () => {
    const flatPostsArray = [];
    const users = {};
    expect(postsTreeFromRawPosts({ flatPostsArray, users })).toEqual([]);
  });
});
