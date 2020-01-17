const { ResultNotFoundError } = require('./errors');
const envLib = require('.');

describe('#get', () => {
  beforeAll(() => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORTS = '3306,3309';
  });

  it('returns process.env values', () => {
    const env = envLib.config({
      contract: [
        {
          key: 'DB_HOST',
          type: 'string',
        },
        {
          key: 'DB_PORTS',
          type: 'integersArray',
        },
      ],
    });

    expect(env.get(['DB_HOST', 'DB_PORTS'])).toEqual({
      DB_HOST: 'localhost',
      DB_PORTS: [3306, 3309],
    });
  });
});
