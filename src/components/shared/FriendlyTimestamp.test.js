import { friendlyTimestamp } from './FriendlyTimestamp';
import addDays from 'date-fns/addDays';

//TODO add tests
describe('friendlyTimestamp', () => {
  it('works', () => {
    const date = new Date();
    const date3DaysAgo = addDays(date, -3);
    const date3DaysAgoMilliseconds = date3DaysAgo.getTime();
    expect(friendlyTimestamp(date3DaysAgoMilliseconds).content).toEqual('3d');
  });
});
