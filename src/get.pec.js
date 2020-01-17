const errors = require('./errors');
const env = require('.');

describe('#get', () => {
  beforeAll(() => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORTS = '3306,3309';
  });

  describe('validations', () => {
    beforeEach(() => {
      // env.processEnv is a global variable:
      // it produces side effect from one test to another
      jest.resetModules();
    });

    describe('when the config function was called', () => {
      it('does not throw', () => {
        env.config([{
          key: 'DB_HOST',
          type: 'string',
        }]);

        expect(() => env.get('DB_HOST'))
          .not.toThrow();
      });
    });

    describe('when the config function was not called', () => {
      let env2;

      beforeEach(() => {
        // eslint-disable-next-line global-require
        env2 = require('.');
      });

      it('throws with ProcessEnvEmptyError', () => {
        expect(() => env2.get('DB_HOST'))
          .toThrow(errors.ProcessEnvEmptyError);
      });
    });
  });

  describe('when the process.env value is found', () => {
    it('returns process.env value', () => {
      env.config([{
        key: 'DB_HOST',
        type: 'string',
      }]);

      expect(env.get('DB_HOST')).toBe(process.env.DB_HOST);
    });
  });

  describe('when the process.env value are found', () => {
    it('returns process.env values', () => {
      env.config([
        {
          key: 'DB_HOST',
          type: 'string',
        },
        {
          key: 'DB_PORTS',
          type: 'integersArray',
        },
      ]);

      expect(env.get(['DB_HOST', 'DB_PORTS'])).toEqual({
        DB_HOST: 'localhost',
        DB_PORTS: [3306, 3309],
      });
    });
  });

  describe('when the process.env value is not found', () => {
    it('throws with NotFoundResultError', () => {
      env.config([{
        key: 'DB_USER',
        type: 'string',
      }]);

      expect(() => env.get('DB_USER'))
        .toThrow(errors.NotFoundResultError);
    });
  });

  describe('validations', () => {
    describe('when the contract contains duplicates variables', () => {
      it('throws with DuplicateEntriesError', () => {
        env.config([
          {
            key: 'DB_HOST',
            type: 'string',
          },
          {
            key: 'DB_HOST',
            type: 'char',
          },
        ]);

        expect(() => env.get('DB_HOST'))
          .toThrow(errors.DuplicateEntriesError);
      });
    });

    describe('when the contract does not contain requested variable', () => {
      it('throws with NotFoundEntryError', () => {
        env.config([{
          key: 'DB_HOST',
          type: 'string',
        }]);

        expect(() => env.get('DB_PORT'))
          .toThrow(errors.NotFoundEntryError);
      });
    });
  });

  describe('default keyword', () => {
    describe('when there is default', () => {
      describe('when the process.env value is found', () => {
        it('returns process.env value', () => {
          env.config([{
            key: 'DB_HOST',
            type: 'string',
            default: 'root',
          }]);

          expect(env.get('DB_HOST')).toBe(process.env.DB_HOST);
        });
      });

      describe('when the process.env value is not found', () => {
        it('returns the default', () => {
          env.config([{
            key: 'DB_USER',
            type: 'string',
            default: 'root',
          }]);

          expect(env.get('DB_USER')).toBe('root');
        });
      });
    });
  });

  describe('transform function', () => {
    it('returns transform result', () => {
      env.config([{
        key: 'DB_HOST',
        type: 'string',
        transform: value => value.toUpperCase(),
      }]);

      expect(env.get('DB_HOST')).toBe('LOCALHOST');
    });
  });

  describe('composed type behaviors', () => {
    it('returns transformed process.env value ', () => {
      env.config([{
        key: 'DB_PORTS',
        type: 'integersArray',
      }]);

      expect(env.get('DB_PORTS')).toEqual([3306, 3309]);
    });
  });
});
