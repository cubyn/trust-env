const {
  ContractNotFoundError,
  DefaultInvalidTypeError,
} = require('./errors');
const env = require('.');

describe('#config', () => {
  beforeEach(() => {
    process.env.DB_HOST = 'localhost';
  });

  describe('when contract is not found', () => {
    it('throws with ContractNotFoundError', () => {
      expect(() => env.config())
        .toThrow(ContractNotFoundError);
    });
  });

  describe('when contract is empty', () => {
    it('throws with ContractNotFoundError', () => {
      expect(() => env.config())
        .toThrow(ContractNotFoundError);
    });
  });

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
        it('throws with DefaultInvalidTypeError', () => {
          const contract = [{
            variable: 'DB_HOST',
            type: 'string',
            default: 1,
          }];

          expect(() => env.config(contract))
            .toThrow(DefaultInvalidTypeError);
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
