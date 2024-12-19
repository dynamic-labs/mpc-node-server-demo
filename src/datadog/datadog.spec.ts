import { DD_ENV } from './constants';

describe('datadog', () => {
  it('ddenv development', () => {
    expect(DD_ENV).toBe('development');
  });
});
