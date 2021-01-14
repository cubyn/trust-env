import TrustEnv, { TrustEnvLib } from '.';

describe('#get', () => {
  let env: TrustEnvLib;

  beforeAll(() => {
    process.env.MYSQL_HOST = 'localhost';
    process.env.MYSQL_PORTS = '3306,3309';

    env = TrustEnv([
      {
        key: 'MYSQL_HOST',
        type: 'string',
      },
      {
        key: 'MYSQL_PORTS',
        type: 'integersArray',
      },
    ]);
  });

  describe('when there is one key', () => {
    it('should returns casted process.env value', () => {
      expect(env.get('MYSQL_PORTS')).toEqual([3306, 3309]);
    });
  });

  describe('when there are several keys', () => {
    it('should returns casted process.env values', () => {
      expect(env.get(['MYSQL_HOST', 'MYSQL_PORTS'])).toEqual({
        MYSQL_HOST: 'localhost',
        MYSQL_PORTS: [3306, 3309],
      });
    });

    describe('when there is a prefix', () => {
      it('should returns casted process.env values', () => {
        expect(env.getPrefix('MYSQL_')).toEqual({
          MYSQL_HOST: 'localhost',
          MYSQL_PORTS: [3306, 3309],
        });
      });
    });
  });
});
