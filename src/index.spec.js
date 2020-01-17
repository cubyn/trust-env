const envLib = require('.');

describe('src/index.js', () => {
  beforeEach(() => {
    process.env.API_URL = 'https://endpoint-a.pi/v3';
    process.env.API_TOKEN = '0%f_a+cVF3';
    process.env.PRICES_RANGE = '0.01,9999.99';
    process.env.POSSIBLES_ALGORITHMS = 'RSA,AES,Blowfish';
    process.env.DISABLED_USERS_PID = '321,987,654';
  });

  it('works', () => {
    const CONTRACT = [
      {
        key: 'API_URL',
        type: 'url',
        default: 'https://endpoint-a.pi/v1',
      },
      {
        key: 'API_TOKEN',
        type: 'string',
      },
      {
        key: 'PRICES_RANGE',
        type: 'numbersArray',
        required: true,
      },
      {
        key: 'POSSIBLES_ALGORITHMS',
        type: 'stringsArray',
        required: true,
        // validator: ({ value }) => value.includes('AES'),
        transform: value => value.map(item => item.toUpperCase()),
      },
      // {
      //   key: 'THROTTLE_MS',
      //   type: 'integer',
      //   default: 1000,
      // },
    ];

    const env = envLib.config({ contract: CONTRACT });

    process.env.API_TOKEN = null;

    expect(env).toEqual({
      API_URL: 'https://endpoint-a.pi/v3',
      API_TOKEN: '0%f_a+cVF3',
      PRICES_RANGE: [0.01, 9999.99],
      POSSIBLES_ALGORITHMS: ['RSA', 'AES', 'BLOWFISH'],
      get: expect.any(Function),
      config: expect.any(Function),
    });
    expect(env.get('DISABLED_USERS_PID')).toBeUndefined();
    expect(env.get('THROTTLE_MS')).toBeUndefined();
  });
});
