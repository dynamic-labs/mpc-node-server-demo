import axios from 'axios';

describe('index', () => {
  it('should pass', async () => {
    const payload = {
      example: 'value',
    };
    const result = await axios.post('http://127.0.0.1:9999/encrypt', payload, {
      headers: {
        'X-Evervault-Data-Role': 'test-role',
        'Content-Type': 'application/json',
      },
    });
    expect(result.data.example).toEqual(expect.stringContaining('ev:debug:'));
  });
});
