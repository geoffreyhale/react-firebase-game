import { statsByUserFromPosts } from './Stats';

describe('statsByUserFromPosts', () => {
  it('handles empty posts object', () => {
    const posts = {};
    expect(statsByUserFromPosts({})).toEqual({});
  });
});
