import { isPremium } from './User';

const millisElapsedSinceUNIXEpoch = Date.now();
const oneMinuteInMillis = 60000;
const millisFromUNIXEpochUntilOneMinuteFromNow =
  millisElapsedSinceUNIXEpoch + oneMinuteInMillis;

const momentAgoInSeconds = millisElapsedSinceUNIXEpoch / 1000;
const hourFromNowInSeconds = millisFromUNIXEpochUntilOneMinuteFromNow / 1000;

describe('isPremium', () => {
  it('empty cases', () => {
    expect(isPremium({ premium: undefined })).toEqual(false);
    expect(isPremium({ premium: null })).toEqual(false);
    expect(isPremium({ premium: {} })).toEqual(false);
    expect(isPremium({ premium: { seconds: 0 } })).toEqual(false);
  });
  it('moment ago', () => {
    expect(isPremium({ premium: { seconds: momentAgoInSeconds } })).toEqual(
      false
    );
  });
  it('minute from now', () => {
    expect(
      isPremium({
        premium: { seconds: hourFromNowInSeconds },
      })
    ).toEqual(true);
  });
});
