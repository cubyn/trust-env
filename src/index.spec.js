// const { ProcessEnvError } = require('./errors');
const env = require('.');

describe('src/index.js', () => {
  beforeEach(() => {
    process.env.DB_HOST = 'localhost';
  });

  describe('when the variable is not found', () => {
    describe('when the default is given', () => {
      it.todo('returns the default');
    });

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
      const CONTRACT = [{
        variable: 'DB_HOST',
        type: 'string',
      }];
      expect(env.validate(CONTRACT)).toBe(true);
    });
  });

  describe('when variable is not the right type', () => {
    it('throws', () => {
      const CONTRACT = [{
        variable: 'DB_HOST',
        type: 'number',
      }];

      expect(() => env.validate(CONTRACT)).toThrow();
    });
  });
});
