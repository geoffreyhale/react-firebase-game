import uidMentions from './uidMentions';

describe('uidMentions', () => {
  it('returns null for no matches', () => {
    expect(uidMentions('')).toEqual(null);
    expect(uidMentions('@1aB2cD3eF4gH5hI6jK7lM8nO9pQ')).toEqual(null);
    expect(uidMentions('1aB2cD3eF4gH5hI6jK7lM8nO9pQ0')).toEqual(null);
    expect(uidMentions('@4aB2cD3eF4gH5hI6jK7lM8nO9pQ000000')).toEqual(null);
  });
  it('returns array of results for valid matches', () => {
    expect(uidMentions('@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0')).toEqual([
      '@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0',
    ]);
    expect(uidMentions(' @1aB2cD3eF4gH5hI6jK7lM8nO9pQ0 ')).toEqual([
      '@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0',
    ]);
    expect(
      uidMentions('@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0 @2aB2cD3eF4gH5hI6jK7lM8nO9pQ0')
    ).toEqual([
      '@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0',
      '@2aB2cD3eF4gH5hI6jK7lM8nO9pQ0',
    ]);
  });
  it.skip('works adjacent to non alphanumeric symbols', () => {
    expect(uidMentions('(@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0)')).toEqual([
      '@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0',
    ]);
  });
});
