const {
  ContractNotFoundError,
  DefaultInvalidTypeError,
  DuplicateEntriesError,
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

    describe('when contract contains a duplicate entry', () => {
      it('throws with DuplicateEntriesError', () => {
        const contract = [
          { key: 'DB_HOST' },
          { key: 'DB_HOST' },
        ];

        expect(() => envLib.config({ contract }))
          .toThrow(DuplicateEntriesError);
      });
    });
  });

  describe('declarations validation', () => {
    describe('when the type of the default is not the same as the type keyword', () => {
      it('throws with DefaultInvalidTypeError', () => {
        const contract = [{
          key: 'DB_HOST',
          type: 'string',
          default: 1,
        }];

        expect(() => envLib.config({ contract }))
          .toThrow(DefaultInvalidTypeError);
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

  // describe('type keyword', () => {
  //   describe('when the type is unknow', () => {
  //     it.todo('throws');
  //   });

  //   describe('when the type is not given', () => {
  //     it.todo('throws');
  //   });
  // });

  // describe('default keyword', () => {
  //   describe('when the default is given', () => {
  //     describe('when the default is not the right type', () => {
  //       it('throws with DefaultInvalidTypeError', () => {
  //         const contract = [{
  //           variable: 'DB_HOST',
  //           type: 'string',
  //           default: 1,
  //         }];

  //         expect(() => env.config(contract))
  //           .toThrow(DefaultInvalidTypeError);
  //       });
  //     });
  //   });
  // });

  // describe('required keyword', () => {
  //   describe('when the variable is required', () => {
  //     describe('when the variable is found', () => {
  //       it.todo('returns the variable');
  //     });

  //     describe('when the variable is not found', () => {
  //       it.todo('throws');
  //     });
  //   });
  // });

  // describe('when there are several types');
});
