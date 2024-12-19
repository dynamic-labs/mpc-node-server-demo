import { secondsToIsoTimestamp } from './date';

describe('date', function () {
  it('should convert to iso string', () => {
    const result = secondsToIsoTimestamp('1630000000');

    expect(result).toBe('2021-08-26T17:46:40.000Z');
  });
});
