import { getInviteCodeFromLocationSearchString } from './inviteCode';

const locationSearch1 = '?inviteCode=1aB2cE3fG';
const locationSearch2 = '?abc=1aB2cE3fG&inviteCode=4hI5jK6lM&qwert=yuiop';
const locationSearch3 = '';
const locationSearch4 = '?abc=1aB2cE3fG';

describe('getValueFromLocationSearch', () => {
  it('inviteCode', () => {
    expect(getInviteCodeFromLocationSearchString(locationSearch1)).toEqual(
      '1aB2cE3fG'
    );
    expect(getInviteCodeFromLocationSearchString(locationSearch2)).toEqual(
      '4hI5jK6lM'
    );
    expect(getInviteCodeFromLocationSearchString(locationSearch3)).toEqual('');
    expect(getInviteCodeFromLocationSearchString(locationSearch4)).toEqual('');
  });
});
