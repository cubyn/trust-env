const env = require('.');

describe('src/index.js', () => {
  beforeAll(() => {
    process.env.API_URL = 'https://endpoint-a.pi/v3';
    process.env.API_TOKEN = '0%f_a+cVF3';
    process.env.DISABLED_USERS_PID = '321,987,654';
  });

  it('works', () => {
    env.config([
      {
        key: 'API_URL',
        type: 'url',
        default: 'https://endpoint-a.pi/v1',
      },
      {
        key: 'API_TOKEN',
        type: 'string',
        required: true,
      },
    ]);

    process.env.API_TOKEN = null;

    expect(env.get('API_URL')).toBe('https://endpoint-a.pi/v3');
    expect(env.get('API_TOKEN')).toBe('0%f_a+cVF3');
  });
});
