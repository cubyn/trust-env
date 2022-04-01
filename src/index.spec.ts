import { expectTypeOf } from 'expect-type';
import TrustEnv, { GetEntryValue, GetEntryValueByPrefix, TrustEnvLib } from '.';

describe('src/index.ts', () => {
  beforeEach(() => {
    process.env.API_URL = 'https://endpoint-a.pi/v3';
    process.env.API_TOKEN = '0%f_a+cVF3';
    process.env.API_SSL = 'false';
    process.env.PRICES_RANGE = '0.01,9999.99';
    process.env.POSSIBLES_ALGORITHMS = 'RSA,aes,Blowfish';
    process.env.DISABLED_USERS_PID = '321,987,654';
    process.env.LIMIT_DATE = '1/1/2020';
    process.env.MONGODB_DEFAULT_USER = '{"name": "Foo"}';
    process.env.MONGODB_SSL;
    process.env.MONGODB_ROOT_PASSWORD;
  });

  it('should work', () => {
    const env = TrustEnv([
      {
        key: 'API_URL',
        type: 'string',
      },
      {
        key: 'API_TOKEN',
        type: 'string',
      },
      {
        key: 'API_SSL',
        type: 'boolean',
      },
      {
        key: 'PRICES_RANGE',
        type: 'numbersArray',
      },
      {
        key: 'POSSIBLES_ALGORITHMS',
        type: 'stringsArray',
        transform: (params) => params.value.map((item: string) => item.toUpperCase()),
        validator: ({ isJs }) => isJs.existy('AES'),
      },
      {
        key: 'LIMIT_DATE',
        type: 'date',
      },
      {
        key: 'MONGODB_DEFAULT_USER',
        type: 'json',
        validator: ({ value, isJs }) => isJs.propertyDefined(value, 'name'),
      },
      {
        key: 'MONGODB_SSL',
        type: 'string',
        required: false,
      },
      {
        key: 'MONGODB_ROOT_PASSWORD',
        type: 'integer',
        required: false,
        preset: '123456789',
      },
      {
        key: 'ADDITIONAL_CONNECTION_PROPERTIES',
        type: 'string',
        required: false,
        preset: '',
      },
      {
        key: 'EXCLUSIONS',
        type: 'integersArray',
        required: false,
        preset: '',
      },
    ]);

    process.env.API_TOKEN = undefined;

    // TrustEnv()
    type OriginalContract = typeof env extends TrustEnvLib<infer P> ? P : never;
    expectTypeOf(env).toEqualTypeOf<{
      get: GetEntryValue<OriginalContract>;
      getPrefix: GetEntryValueByPrefix<OriginalContract>;
      API_URL: string;
      API_TOKEN: string;
      API_SSL: boolean;
      PRICES_RANGE: number[];
      POSSIBLES_ALGORITHMS: string[];
      LIMIT_DATE: Date;
      // eslint-disable-next-line @typescript-eslint/ban-types
      MONGODB_DEFAULT_USER: object;
      MONGODB_SSL: string;
      MONGODB_ROOT_PASSWORD: number;
      ADDITIONAL_CONNECTION_PROPERTIES: string;
      EXCLUSIONS: number[];
    }>();
    expect(env).toEqual({
      get: expect.any(Function),
      getPrefix: expect.any(Function),
      API_URL: 'https://endpoint-a.pi/v3',
      API_TOKEN: '0%f_a+cVF3',
      API_SSL: false,
      PRICES_RANGE: [0.01, 9999.99],
      POSSIBLES_ALGORITHMS: ['RSA', 'AES', 'BLOWFISH'],
      LIMIT_DATE: new Date('1/1/2020'),
      MONGODB_DEFAULT_USER: { name: 'Foo' },
      MONGODB_SSL: undefined,
      MONGODB_ROOT_PASSWORD: 123456789,
      ADDITIONAL_CONNECTION_PROPERTIES: '',
      EXCLUSIONS: [],
    });

    // getPrefix()
    const getByPrefix = env.getPrefix('API');
    expectTypeOf(getByPrefix.API_SSL).toEqualTypeOf<boolean>();
    expectTypeOf(getByPrefix.API_URL).toEqualTypeOf<string>();

    expect(getByPrefix).toEqual({
      API_URL: 'https://endpoint-a.pi/v3',
      API_TOKEN: '0%f_a+cVF3',
      API_SSL: false,
    });

    // get()
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-expect-error
    expect(env.get('DISABLED_USERS_PID')).toBeUndefined();
    // @ts-expect-error
    expect(env.get('THROTTLE_MS')).toBeUndefined();
    // @ts-expect-error
    expect(env.get(['THROTTLE_MS'])).toMatchObject({ THROTTLE_MS: undefined });
    expectTypeOf(env.get('API_TOKEN')).toEqualTypeOf<string>();
    expectTypeOf(env.get('API_SSL')).toEqualTypeOf<boolean>();
    expectTypeOf(env.get('PRICES_RANGE')).toEqualTypeOf<number[]>();
    expectTypeOf(env.get(['PRICES_RANGE', 'API_SSL'])).toEqualTypeOf<{
      PRICES_RANGE: number[];
      API_SSL: boolean;
    }>();
    expect(env.get(['API_TOKEN', 'API_SSL'])).toEqual({
      API_TOKEN: '0%f_a+cVF3',
      API_SSL: false,
    });
  });
});
