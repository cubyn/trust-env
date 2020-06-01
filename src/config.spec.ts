import { ContractNotFoundError } from './errors/contract-not-found-error';
import { EntryKeyNotFoundError } from './errors/entry-key-not-found-error';
import { EntryNotUniqueError } from './errors/entry-not-unique-error';
import { EntryNotValidError } from './errors/entry-not-valid-error';
import { EntryTypeNotFoundError } from './errors/entry-type-not-found-error';
import { EntryValidatorNotSucceededError } from './errors/entry-validator-not-succeeded-error';
import { Contract } from './types';
import TrustEnv from '.';

describe('#config', () => {
  beforeEach(() => {
    process.env.MYSQL_HOST = 'localhost';
  });

  describe('contract validation', () => {
    describe('when contract not given', () => {
      it('should throws with ContractNotFoundError', () => {
        expect(() => TrustEnv()).toThrow(ContractNotFoundError);
      });
    });

    describe('when contract is empty', () => {
      it('should throws with ContractNotFoundError', () => {
        expect(() => TrustEnv([])).toThrow(ContractNotFoundError);
      });
    });

    describe('when contract has duplicates entries', () => {
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
    describe('when key property is not found', () => {
      it('should throws with EntryKeyNotFoundError', () => {
        const contract: Contract = [{ type: 'string' }];

        expect(() => TrustEnv(contract)).toThrow(EntryKeyNotFoundError);
      });
    });

    describe('when type property is not found', () => {
      it('should throws with EntryTypeNotFoundError', () => {
        const contract: Contract = [{ key: 'MYSQL_HOST' }];

        expect(() => TrustEnv(contract)).toThrow(EntryTypeNotFoundError);
      });
    });

    describe('when validator function does not return a truthy', () => {
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

    describe('when validator function returns a truthy', () => {
      it('does not throws', () => {
        const contract: Contract = [
          {
            key: 'MYSQL_HOST',
            type: 'string',
            validator: ({ value }) => value.startsWith('local'),
          },
        ];

        expect(() => TrustEnv(contract)).not.toThrow(EntryNotValidError);
      });
    });

    // describe('when the type of the default is not the same as the type property', () => {
    //   it('should throws with EntryDefaultTypeNotValidError', () => {
    //     const contract = [{
    //       key: 'MYSQL_HOST',
    //       type: 'string',
    //       default: 1,
    //     }];

    //     expect(() => TrustEnv(contract))
    //       .toThrow(EntryDefaultTypeNotValidError);
    //   });
    // });
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
      config: expect.any(Function),
      MYSQL_HOST: 'localhost',
    });
  });
});
