const envLib = require('.');

describe('#get', () => {
  let env;

  beforeAll(() => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORTS = '3306,3309';

    env = envLib.config({
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
  });

  describe('when there is one key', () => {
    it('returns process.env value', () => {
      expect(env.get('DB_PORTS')).toEqual([3306, 3309]);
    });
  });

  describe('when there are several keys', () => {
    it('returns process.env values', () => {
      expect(env.get(['DB_HOST', 'DB_PORTS'])).toEqual({
        DB_HOST: 'localhost',
        DB_PORTS: [3306, 3309],
      });
    });

    describe('when there is a prefix', () => {
      it('returns process.env values', () => {
        expect(env.getPrefix('DB_')).toEqual({
          DB_HOST: 'localhost',
          DB_PORTS: [3306, 3309],
        });
      });
    });
  });
});
