import { ContractNotFoundError } from './errors/contract-not-found-error';
import { EntryNotUniqueError } from './errors/entry-not-unique-error';
import { EntryNotValidError } from './errors/entry-not-valid-error';
import { EntryValidatorNotSucceededError } from './errors/entry-validator-not-succeeded-error';
import { EntryValueNotFoundError } from './errors/entry-value-not-found-error';
import { Contract } from './types';
import TrustEnv from '.';

describe('#config', () => {
  beforeEach(() => {
    process.env.MYSQL_HOST = 'localhost';
  });

  it('should return functions and variables', () => {
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
    describe('when the contract is empty', () => {
      it('should throw with ContractNotFoundError', () => {
        expect(() => TrustEnv([])).toThrow(ContractNotFoundError);
      });
    });

    describe('when the contract has duplicates entries', () => {
      it('should throw with EntryNotUniqueError', () => {
        const contract: Contract = [
          { key: 'MYSQL_HOST', type: 'string' },
          { key: 'MYSQL_HOST', type: 'integer' },
        ];

        expect(() => TrustEnv(contract)).toThrow(EntryNotUniqueError);
      });
    });
  });

  describe('entries validation', () => {
    describe('when the value is not found', () => {
      describe('when the value is required', () => {
        it('should throw with EntryValueNotFoundError', () => {
          const contract: Contract = [
            {
              key: 'NONEXISTENT',
              type: 'string',
            },
          ];

          expect(() => TrustEnv(contract)).toThrow(EntryValueNotFoundError);
        });
      });

      describe('when the value is not required', () => {
        describe('when there is a preset', () => {
          it('should return the preset', () => {
            const contract: Contract = [
              {
                key: 'NONEXISTENT',
                type: 'string',
                required: false,
                preset: 'DEFINED',
              },
            ];

            const env = TrustEnv(contract);

            expect(env.get('NONEXISTENT')).toBe('DEFINED');
          });
        });

        describe('when there is not preset', () => {
          it('should return undefined', () => {
            const contract: Contract = [
              {
                key: 'NONEXISTENT',
                type: 'string',
                required: false,
              },
            ];

            const env = TrustEnv(contract);

            expect(env.get('NONEXISTENT')).toBeUndefined();
          });
        });
      });
    });
  });
});

describe('when validator function does not return true', () => {
  it('should throw with EntryValidatorNotSucceededError', () => {
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
  it('should not throw', () => {
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
