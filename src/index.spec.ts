import { Contract } from './types';
import TrustEnv from '.';

describe('src/index.ts', () => {
  beforeEach(() => {
    process.env.API_URL = 'https://endpoint-a.pi/v3';
    process.env.API_TOKEN = '0%f_a+cVF3';
    process.env.PRICES_RANGE = '0.01,9999.99';
    process.env.POSSIBLES_ALGORITHMS = 'RSA,aes,Blowfish';
    process.env.DISABLED_USERS_PID = '321,987,654';
    process.env.LIMIT_DATE = '1/1/2020';
    process.env.DEFAULT_USER = '{"name": "Foo"}';
    process.env.ROOT_PASSWORD;
  });

  it('should work', () => {
    const contract: Contract = [
      {
        key: 'API_URL',
        type: 'string',
      },
      {
        key: 'API_TOKEN',
        type: 'string',
      },
      {
        key: 'PRICES_RANGE',
        type: 'numbersArray',
      },
      {
        key: 'POSSIBLES_ALGORITHMS',
        type: 'stringsArray',
        transform: ({ value }) => value.map((item: string) => item.toUpperCase()),
        validator: ({ isJs }) => isJs.existy('AES'),
      },
      {
        key: 'LIMIT_DATE',
        type: 'date',
      },
      {
        key: 'DEFAULT_USER',
        type: 'json',
        validator: ({ value, isJs }) => isJs.propertyDefined(value, 'name'),
      },
      {
        key: 'ROOT_PASSWORD',
        type: 'string',
        required: false,
      },
    ];

    const env = TrustEnv(contract);

    process.env.API_TOKEN = undefined;

    expect(env).toEqual({
      get: expect.any(Function),
      getPrefix: expect.any(Function),
      API_URL: 'https://endpoint-a.pi/v3',
      API_TOKEN: '0%f_a+cVF3',
      PRICES_RANGE: [0.01, 9999.99],
      POSSIBLES_ALGORITHMS: ['RSA', 'AES', 'BLOWFISH'],
      LIMIT_DATE: new Date('1/1/2020'),
      DEFAULT_USER: { name: 'Foo' },
    });
    expect(env.getPrefix('API')).toEqual({
      API_URL: 'https://endpoint-a.pi/v3',
      API_TOKEN: '0%f_a+cVF3',
    });
    expect(env.get('DISABLED_USERS_PID')).toBeUndefined();
    expect(env.get('THROTTLE_MS')).toBeUndefined();
  });
});
