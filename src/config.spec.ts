// import { EntryKeyNotFoundError } from './errors/entry-key-not-found-error';
// import { EntryTypeNotFoundError } from './errors/entry-type-not-found-error';
import { ContractNotFoundError } from './errors/contract-not-found-error';
import { EntryNotUniqueError } from './errors/entry-not-unique-error';
import { EntryNotValidError } from './errors/entry-not-valid-error';
import { EntryPresetTypeNotValidError } from './errors/entry-preset-type-not-valid-error';
import { EntryValidatorNotSucceededError } from './errors/entry-validator-not-succeeded-error';
import { EntryValueNotFoundError } from './errors/entry-value-not-found-error';
import { Contract } from './types';
import TrustEnv from '.';

describe('#config', () => {
  beforeEach(() => {
    process.env.MYSQL_HOST = 'localhost';
  });

  it('should returns functions and variables', () => {
    const contract: Contract = [
      {
        key: 'MYSQL_HOST',
        type: 'string',
      },
    ];

    expect(TrustEnv(contract)).toEqual({
      get: expect.any(Function),
      getPrefix: expect.any(Function),
      MYSQL_HOST: 'localhost',
    });
  });

  describe('contract validation', () => {
    // describe('when a contract is not given', () => {
    //   it('should throws with ContractNotFoundError', () => {
    //     expect(() => TrustEnv()).toThrow(ContractNotFoundError);
    //   });
    // });

    describe('when the contract is empty', () => {
      it('should throws with ContractNotFoundError', () => {
        expect(() => TrustEnv([])).toThrow(ContractNotFoundError);
      });
    });

    describe('when the contract has duplicates entries', () => {
      it('should throws with EntryNotUniqueError', () => {
        const contract: Contract = [
          { key: 'MYSQL_HOST', type: 'string' },
          { key: 'MYSQL_HOST', type: 'string' },
        ];

        expect(() => TrustEnv(contract)).toThrow(EntryNotUniqueError);
      });
    });
  });

  describe('entries validation', () => {
    describe('when the value is not found', () => {
      describe('when strict option is true', () => {
        it('should throws with EntryValueNotFoundError', () => {
          const contract: Contract = [
            {
              key: 'NONEXISTENT',
              type: 'string',
            },
          ];

          expect(() => TrustEnv(contract)).toThrow(EntryValueNotFoundError);
        });
      });

      describe('when strict option is false', () => {
        describe('when preset property is found', () => {
          it('should use the preset', () => {
            const contract: Contract = [
              {
                key: 'NONEXISTENT',
                type: 'string',
                preset: 'EXISTS',
              },
            ];

            const env = TrustEnv(contract, { strict: false });

            expect(env.get('NONEXISTENT')).toBe('EXISTS');
          });
        });

        describe('when type property is not found ', () => {
          it('should throws with EntryValueNotFoundError', () => {
            const contract: Contract = [
              {
                key: 'NONEXISTENT',
                type: 'string',
              },
            ];

            expect(() => TrustEnv(contract, { strict: false })).toThrow(EntryValueNotFoundError);
          });
        });
      });
    });

    // describe('when key property is not found', () => {
    //   it('should throws with EntryKeyNotFoundError', () => {
    //     const contract: Contract = [{ type: 'string' }];

    //     expect(() => TrustEnv(contract)).toThrow(EntryKeyNotFoundError);
    //   });
    // });

    // describe('when type property is not found', () => {
    //   it('should throws with EntryTypeNotFoundError', () => {
    //     const contract: Contract = [{ key: 'MYSQL_HOST' }];

    //     expect(() => TrustEnv(contract)).toThrow(EntryTypeNotFoundError);
    //   });
    // });

    describe('when validator function does not return true', () => {
      it('should throws with EntryValidatorNotSucceededError', () => {
        const contract: Contract = [
          {
            key: 'MYSQL_HOST',
            type: 'string',
            validator: () => false,
          },
        ];

        expect(() => TrustEnv(contract)).toThrow(EntryValidatorNotSucceededError);
      });
    });

    describe('when validator function returns true', () => {
      it('does not throws', () => {
        const contract: Contract = [
          {
            key: 'MYSQL_HOST',
            type: 'string',
            validator: () => true,
          },
        ];

        expect(() => TrustEnv(contract)).not.toThrow(EntryNotValidError);
      });
    });

    describe('when the type of the preset is not the same as the type property', () => {
      it('should throws with EntryPresetTypeNotValidError', () => {
        const contract: Contract = [
          {
            key: 'MYSQL_HOST',
            type: 'string',
            preset: 1,
          },
        ];

        expect(() => TrustEnv(contract)).toThrow(EntryPresetTypeNotValidError);
      });
    });
  });
});
