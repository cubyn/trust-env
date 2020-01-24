const {
  ContractNotFoundError,
  EntryKeyNotFoundError,
  EntryNotUniqueError,
  EntryNotValidError,
  EntryTypeNotFoundError,
  EntryValidatorNotSucceededError,
} = require('./errors');
const envLib = require('.');

describe('#config', () => {
  beforeEach(() => {
    process.env.DB_HOST = 'localhost';
  });

  describe('contract validation', () => {
    describe('when contract not given', () => {
      it('throws with ContractNotFoundError', () => {
        expect(() => envLib.config())
          .toThrow(ContractNotFoundError);
      });
    });

    describe('when contract is empty', () => {
      it('throws with ContractNotFoundError', () => {
        expect(() => envLib.config([]))
          .toThrow(ContractNotFoundError);
      });
    });

    describe('when contract has duplicates entries', () => {
      it('throws with EntryNotUniqueError', () => {
        const contract = [
          { key: 'DB_HOST' },
          { key: 'DB_HOST' },
        ];

        expect(() => envLib.config(contract))
          .toThrow(EntryNotUniqueError);
      });
    });
  });

  describe('entries validation', () => {
    describe('when key property is not found', () => {
      it('throws with EntryKeyNotFoundError', () => {
        const contract = [{ type: 'string' }];

        expect(() => envLib.config(contract))
          .toThrow(EntryKeyNotFoundError);
      });
    });

    describe('when type property is not found', () => {
      it('throws with EntryTypeNotFoundError', () => {
        const contract = [{ key: 'DB_HOST' }];

        expect(() => envLib.config(contract))
          .toThrow(EntryTypeNotFoundError);
      });
    });

    describe('when validator function does not return a truthy', () => {
      it('throws with EntryValidatorNotSucceededError', () => {
        const contract = [{
          key: 'DB_HOST',
          type: 'string',
          validator: () => false,
        }];

        expect(() => envLib.config(contract))
          .toThrow(EntryValidatorNotSucceededError);
      });
    });

    describe('when validator function returns a truthy', () => {
      it('does not throws', () => {
        const contract = [{
          key: 'DB_HOST',
          type: 'string',
          validator: ({ value }) => value.startsWith('local'),
        }];

        expect(() => envLib.config(contract))
          .not.toThrow(EntryNotValidError);
      });
    });

    // describe('when the type of the default is not the same as the type property', () => {
    //   it('throws with EntryDefaultTypeNotValidError', () => {
    //     const contract = [{
    //       key: 'DB_HOST',
    //       type: 'string',
    //       default: 1,
    //     }];

    //     expect(() => envLib.config(contract))
    //       .toThrow(EntryDefaultTypeNotValidError);
    //   });
    // });
  });

  it('returns functions and variables', () => {
    const contract = [{
      key: 'DB_HOST',
      type: 'string',
    }];

    expect(envLib.config(contract)).toEqual({
      get: expect.any(Function),
      getPrefix: expect.any(Function),
      config: expect.any(Function),
      DB_HOST: 'localhost',
    });
  });
});
