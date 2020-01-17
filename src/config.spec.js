const {
  ContractNotFoundError,
  EntryDefaultTypeNotValidError,
  EntryNotUniqueError,
  EntryNotValidError,
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
        expect(() => envLib.config({ contract: [] }))
          .toThrow(ContractNotFoundError);
      });
    });

    describe('when contract has duplicates entries', () => {
      it('throws with EntryNotUniqueError', () => {
        const contract = [
          { key: 'DB_HOST' },
          { key: 'DB_HOST' },
        ];

        expect(() => envLib.config({ contract }))
          .toThrow(EntryNotUniqueError);
      });
    });
  });

  describe('declarations validation', () => {
    describe('when key property is not found', () => {
      it('throws with EntryNotValidError', () => {
        const contract = [{ type: 'string' }];

        expect(() => envLib.config({ contract }))
          .toThrow(EntryNotValidError);
      });
    });

    describe('when type or validator properties are not found', () => {
      it('throws with EntryNotValidError', () => {
        const contract = [{ key: 'DB_HOST' }];

        expect(() => envLib.config({ contract }))
          .toThrow(EntryNotValidError);
      });
    });

    describe('when type and validator properties are found', () => {
      it('throws with EntryNotValidError', () => {
        const contract = [{
          key: 'DB_HOST',
          type: 'string',
          validator: entry => entry.key === 'DB_HOST',
        }];

        expect(() => envLib.config({ contract }))
          .toThrow(EntryNotValidError);
      });
    });

    describe('when validator is not a function', () => {
      it('throws with EntryNotValidError', () => {
        const contract = [{
          key: 'DB_HOST',
          type: 'string',
          validator: true,
        }];

        expect(() => envLib.config({ contract }))
          .toThrow(EntryNotValidError);
      });
    });

    describe('when validator function does not return a truthy', () => {
      it('throws with EntryNotValidError', () => {
        const contract = [{
          key: 'DB_HOST',
          type: 'string',
          validator: entry => entry && false,
        }];

        expect(() => envLib.config({ contract }))
          .toThrow(EntryNotValidError);
      });
    });

    describe('when validator function returns a truthy', () => {
      it('does not throws', () => {
        const contract = [{
          key: 'DB_HOST',
          validator: entry => entry.key.startsWith('DB'),
        }];

        expect(() => envLib.config({ contract }))
          .not.toThrow(EntryNotValidError);
      });
    });

    describe('when the type of the default is not the same as the type property', () => {
      it('throws with EntryDefaultTypeNotValidError', () => {
        const contract = [{
          key: 'DB_HOST',
          type: 'string',
          default: 1,
        }];

        expect(() => envLib.config({ contract }))
          .toThrow(EntryDefaultTypeNotValidError);
      });
    });
  });

  it('returns functions and variables', () => {
    const contract = [{
      key: 'DB_HOST',
      type: 'string',
    }];

    expect(envLib.config({ contract })).toEqual({
      get: expect.any(Function),
      config: expect.any(Function),
      DB_HOST: 'localhost',
    });
  });

  describe('type property', () => {
    describe('when the type is unknow', () => {
      it.todo('throws');
    });
  });

  describe('required property', () => {
    describe('when the variable is required', () => {
      describe('when the variable is found', () => {
        it.todo('returns the variable');
      });

      describe('when the variable is not found', () => {
        it.todo('throws');
      });
    });
  });
});
