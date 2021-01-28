import getMillisFromDifferingTypes from './getMillisFromDifferingTypes';

describe('getMillisFromDifferingTypes', () => {
  it('handles null', () => {
    expect(getMillisFromDifferingTypes(null)).toEqual(null);
  });
  it('returns number as number', () => {
    expect(getMillisFromDifferingTypes(1234567890)).toEqual(1234567890);
  });
  it('handles object without toMillis()', () => {
    expect(getMillisFromDifferingTypes({})).toEqual(null);
  });
  it('returns toMillis() of object', () => {
    expect(getMillisFromDifferingTypes({ toMillis: () => 1234567890 })).toEqual(
      1234567890
    );
  });
});
