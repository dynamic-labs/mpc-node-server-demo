import axios from 'axios';
import { evervaultEncrypt } from './evervault';
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

describe('Evervault service', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('can encrypt a string payload', async () => {
    const encryptedPayload = 'some ev encrypted string';
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        payload: encryptedPayload,
      },
      status: 200,
    });

    expect(await evervaultEncrypt('some string')).toBe(encryptedPayload);
  });

  it('throws runtime error if axios response is not 200', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 500,
    });

    await expect(evervaultEncrypt('some string')).rejects.toThrow();
  });
});
