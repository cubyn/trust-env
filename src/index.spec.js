const { ProcessEnvError } = require('./errors');
const envValidation = require('.');

describe('env validation', () => {
  describe('when there is dotenv error', () => {
    it('throws with Error', () => {
      const dotenv = {
        error: 'error message',
        parsed: null,
      };

      expect(() => envValidation(dotenv)).toThrow(Error);
    });
  });

  describe('when there is no dotenv error', () => {
    describe('when there is env variable missing value', () => {
      it('throws with ProcessEnvError', () => {
        const dotenv = {
          error: null,
          parsed: { AMQP_HOST: null },
        };

        expect(() => envValidation(dotenv)).toThrow(ProcessEnvError);
      });
    });

    describe('when there is env variable empty value', () => {
      it('throws with ProcessEnvError', () => {
        const dotenv = {
          error: null,
          parsed: { AMQP_HOST: '' },
        };

        expect(() => envValidation(dotenv)).toThrow(ProcessEnvError);
      });
    });

    describe('when there is no env variable missing value', () => {
      it('does nothing', () => {
        const dotenv = {
          error: null,
          parsed: { AMQP_HOST: '127.0.0.1:5672' },
        };

        expect(() => envValidation(dotenv)).not.toThrow();
      });
    });
  });
});
