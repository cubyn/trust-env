const errors = require('./errors');
const env = require('.');

describe('#get', () => {
  beforeAll(() => {
    process.env.DB_HOST = 'localhost';
  });

  describe('when the contract contains duplicates variables', () => {
    it('throws with DuplicateEntriesError', () => {
      env.config([
        {
          variable: 'DB_HOST',
          type: 'string',
        },
        {
          variable: 'DB_HOST',
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
        variable: 'DB_HOST',
        type: 'string',
      }]);

      expect(() => env.get('DB_PORT'))
        .toThrow(errors.NotFoundEntryError);
    });
  });

  describe('when the process.env value is found', () => {
    describe('when there is default', () => {
      it('returns process.env value', () => {
        env.config([{
          variable: 'DB_HOST',
          type: 'string',
          default: 'mysql',
        }]);

        expect(env.get('DB_HOST')).toBe(process.env.DB_HOST);
      });
    });

    describe('when there is no default', () => {
      it('returns process.env value', () => {
        env.config([{
          variable: 'DB_HOST',
          type: 'string',
        }]);

        expect(env.get('DB_HOST')).toBe(process.env.DB_HOST);
      });
    });

    describe('when there is transform function', () => {
      it('returns transform result', () => {
        env.config([{
          variable: 'DB_HOST',
          type: 'string',
          transform: value => value.toUpperCase(),
        }]);

        expect(env.get('DB_HOST')).toBe('LOCALHOST');
      });
    });
  });

  describe('when the process.env value is not found', () => {
    describe('when there is default', () => {
      it('returns the default', () => {
        env.config([{
          variable: 'DB_USER',
          type: 'string',
          default: 'root',
        }]);

        expect(env.get('DB_USER')).toBe('root');
      });
    });

    describe('when there is no default', () => {
      it('throws with NotFoundResultError', () => {
        env.config([{
          variable: 'DB_USER',
          type: 'string',
        }]);

        expect(() => env.get('DB_USER'))
          .toThrow(errors.NotFoundResultError);
      });
    });
  });
});
