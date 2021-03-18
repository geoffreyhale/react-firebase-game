import uidMentions from './uidMentions';

describe('uidMentions', () => {
  it('returns empty array for no matches', () => {
    expect(uidMentions('')).toEqual([]);
    expect(uidMentions('@1aB2cD3eF4gH5hI6jK7lM8nO9pQ')).toEqual([]);
    expect(uidMentions('1aB2cD3eF4gH5hI6jK7lM8nO9pQ0')).toEqual([]);
  });
  it('returns empty array for @toomanyalphanumericcharacters', () => {
    expect(uidMentions('@4aB2cD3eF4gH5hI6jK7lM8nO9pQ000000')).toEqual([]);
  });
  it('returns array of results for valid matches', () => {
    expect(uidMentions('@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0')).toEqual([
      '1aB2cD3eF4gH5hI6jK7lM8nO9pQ0',
    ]);
    expect(uidMentions(' @1aB2cD3eF4gH5hI6jK7lM8nO9pQ0 ')).toEqual([
      '1aB2cD3eF4gH5hI6jK7lM8nO9pQ0',
    ]);
    expect(
      uidMentions('@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0 @2aB2cD3eF4gH5hI6jK7lM8nO9pQ0')
    ).toEqual(['1aB2cD3eF4gH5hI6jK7lM8nO9pQ0', '2aB2cD3eF4gH5hI6jK7lM8nO9pQ0']);
  });
  it('works adjacent to non alphanumeric characters', () => {
    expect(uidMentions('(@1aB2cD3eF4gH5hI6jK7lM8nO9pQ0)')).toEqual([
      '1aB2cD3eF4gH5hI6jK7lM8nO9pQ0',
    ]);
  });
});
