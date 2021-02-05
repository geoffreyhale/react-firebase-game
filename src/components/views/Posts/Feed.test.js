import { getHotFeed, hotScore } from './Feed';

const now = Date.now();
const minuteAgo = Date.now() - 60000;
const hourAgo = Date.now() - 3.6e6;
const dayAgo = Date.now() - 8.64e7;
const weekAgo = Date.now() - 7 * 8.64e7;
const monthAgo = Date.now() - 31 * 8.64e7;

const zero1s = { upvote: [], timestamp: now };
const zero1d = { upvote: [], timestamp: dayAgo };
const one1s = { upvote: [{}], timestamp: now };
const one1minute = { upvote: [{}], timestamp: minuteAgo };
const one1h = { upvote: [{}], timestamp: hourAgo };
const one1d = { upvote: [{}], timestamp: dayAgo };
const one1w = { upvote: [{}], timestamp: weekAgo };
const one1m = { upvote: [{}], timestamp: monthAgo };
const ten1h = { upvote: Array(10).fill({}), timestamp: hourAgo };
const ten1d = { upvote: Array(10).fill({}), timestamp: dayAgo };
const ten1w = { upvote: Array(10).fill({}), timestamp: weekAgo };
const ten1m = { upvote: Array(10).fill({}), timestamp: monthAgo };
const hundred1d = { upvote: Array(100).fill({}), timestamp: dayAgo };
const hundred1w = { upvote: Array(100).fill({}), timestamp: weekAgo };

// TODO add tests for new childNodes inclusion
describe('hotScore', () => {
  it('works', () => {
    expect(hotScore({ post: one1s })).toEqual(200000);
    expect(hotScore({ post: zero1s })).toEqual(100000);
    expect(hotScore({ post: one1minute })).toEqual(20000);
    expect(hotScore({ post: ten1h })).toEqual(11000);
    expect(hotScore({ post: hundred1d })).toEqual(10100);
    expect(hotScore({ post: one1h })).toEqual(2000);
    expect(hotScore({ post: ten1d })).toEqual(1100);
    expect(hotScore({ post: hundred1w })).toEqual(1010);
    expect(hotScore({ post: one1d })).toEqual(200);
    expect(hotScore({ post: ten1w })).toEqual(110);
    expect(hotScore({ post: zero1d })).toEqual(100);
    expect(hotScore({ post: one1w })).toEqual(20);
    expect(hotScore({ post: ten1m })).toEqual(11);
    expect(hotScore({ post: one1m })).toEqual(2);
  });
});

// TODO add tests for new childNodes inclusion
describe('getHotFeed', () => {
  it('handles empty object and missing parameters', () => {
    const posts = [{}, {}];
    expect(getHotFeed({ posts })).toEqual([
      [{}, {}],
      'Upvotes and recency (upvotes / days old)',
    ]);
  });
  it('works', () => {
    const posts = [
      ten1w,
      ten1d,
      one1s,
      hundred1w,
      zero1s,
      one1m,
      one1w,
      one1d,
      hundred1d,
      zero1d,
      ten1m,
      ten1h,
      one1minute,
      one1h,
    ];
    const expected = [
      one1s,
      zero1s,
      one1minute,
      ten1h,
      hundred1d,
      one1h,
      ten1d,
      hundred1w,
      one1d,
      ten1w,
      zero1d,
      one1w,
      ten1m,
      one1m,
    ];
    expect(getHotFeed({ posts })[0]).toEqual(expected);
  });
});
