const errors = require('./errors');
const env = require('.');

describe('src/index.js', () => {
  let contract;

  beforeEach(() => {
    process.env.DB_HOST = 'localhost';
  });

  describe('#config', () => {
    describe('type keyword', () => {
      describe('when the type is unknow', () => {
        it.todo('throws');
      });

      describe('when the type is not given', () => {
        it.todo('throws');
      });
    });

    describe('default keyword', () => {
      describe('when the default is given', () => {
        describe('when the default is not the right type', () => {
          it('throws', () => {
            contract = [{
              variable: 'DB_HOST',
              type: 'string',
              default: 1,
            }];

            expect(() => env.config(contract)).toThrow();
          });
        });
      });
    });

    describe('required keyword', () => {
      describe('when the variable is required', () => {
        describe('when the variable is found', () => {
          it.todo('returns the variable');
        });

        describe('when the variable is not found', () => {
          it.todo('throws');
        });
      });
    });

    // describe('when there are several types');
  });

  describe('#getEnv', () => {
    describe('when the contract contains duplicates variables', () => {
      beforeEach(() => {
        contract = [
          {
            variable: 'DB_HOST',
            type: 'string',
          },
          {
            variable: 'DB_HOST',
            type: 'char',
          },
        ];
        env.config(contract);
      });

      it('throws with CarotteEnvContractDuplicateEntries', () => {
        expect(() => env.getEnv('DB_HOST'))
          .toThrow(errors.ContractDuplicateEntries);
      });
    });

    describe('when the contract does not contain variable', () => {
      beforeEach(() => {
        contract = [{
          variable: 'DB_HOST',
          type: 'string',
        }];
        env.config(contract);
      });

      it('throws with CarotteEnvContractNotFoundEntry', () => {
        expect(() => env.getEnv('DB_PORT'))
          .toThrow(errors.ContractNotFoundEntry);
      });
    });

    describe('when the process.env value is found', () => {
      beforeEach(() => {
        env.config([{
          variable: 'DB_HOST',
          type: 'string',
        }]);
      });

      it('returns process.env value', () => {
        expect(env.getEnv('DB_HOST')).toBe(process.env.DB_HOST);
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
          expect(env.getEnv('DB_USER')).toBe('root');
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
          expect(() => env.getEnv('DB_USER')).toThrow();
        });
      });
    });
  });
});
