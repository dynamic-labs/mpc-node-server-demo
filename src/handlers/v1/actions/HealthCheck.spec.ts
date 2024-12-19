import { testServer } from '../../../../tests/TestServer';

describe('HealthCheck', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('GET /api/v1/actions/HealthCheck', async () => {
    const result = await testServer.app
      .get('/api/v1/actions/HealthCheck')
      .set('Accept', 'application/json');

    expect(result.status).toBe(200);
    expect(result).toSatisfyApiSpec();
  });
});
