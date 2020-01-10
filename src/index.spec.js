// const { ProcessEnvError } = require('./errors');
const env = require('.');

describe('src/index.js', () => {
  beforeEach(() => {
    process.env.DB_HOST = 'localhost';
  });

  describe('#validate', () => {
    describe('when the variable is not found', () => {
      describe('when the default is not given', () => {
        it.todo('throws');
      });
    });

    describe('when the variable is required', () => {
      describe('when the variable is found', () => {
        it.todo('returns the variable');
      });

      describe('when the variable is not found', () => {
        it.todo('throws');
      });
    });

    describe('when the type is unknow', () => {
      it.todo('throws');
    });

    describe('when the type is not given', () => {
      it.todo('throws');
    });

    describe('when the required and default are given', () => {
      it.todo('throws');
    });

    // describe('when there are several types');

    describe('when the default is given', () => {
      describe('when the default is not the right type', () => {
        it.todo('throws');
      });

      describe('when the default is the right type', () => {
        it.todo('returns the variable');
      });
    });

    describe('when variable is the right type', () => {
      it('returns true', () => {
        env.config([{
          variable: 'DB_HOST',
          type: 'string',
        }]);

        expect(env.validate()).toBe(true);
      });
    });

    describe('when variable is not the right type', () => {
      it('throws', () => {
        env.config([{
          variable: 'DB_HOST',
          type: 'number',
        }]);

        expect(() => env.validate()).toThrow();
      });
    });
  });

  describe('#get', () => {
    describe('when the process.env value is found', () => {
      beforeEach(() => {
        env.config([{
          variable: 'DB_HOST',
          type: 'string',
        }]);
      });

      it('returns process.env value', () => {
        expect(env.get('DB_HOST')).toBe(process.env.DB_HOST);
      });
    });

    describe('when the process.env value is not found', () => {
      describe('when there is default', () => {
        beforeEach(() => {
          env.config([{
            variable: 'DB_USER',
            type: 'string',
            default: 'root',
          }]);
        });

        it('returns the default', () => {
          expect(env.get('DB_USER')).toBe('root');
        });
      });

      describe('when there is no default', () => {
        beforeEach(() => {
          env.config([{
            variable: 'DB_USER',
            type: 'string',
          }]);
        });

        it('throws', () => {
          expect(() => env.get('DB_USER')).toThrow();
        });
      });
    });
  });
});
