const { ServerError, EnvValidationError } = require('./modules/errors');
const envValidation = require('.');

describe('env-validation', () => {
  describe('when there is dotenv error', () => {
    it('throws with ServerError', () => {
      const dotenv = {
        error: 'error message',
        parsed: null,
      };

      expect(() => envValidation(dotenv)).toThrow(ServerError);
    });
  });

  describe('when there is no dotenv error', () => {
    describe('when there is env variable value missing', () => {
      it('throws with EnvValidationError', () => {
        const dotenv = {
          error: null,
          parsed: { AMQP_HOST: null },
        };

        expect(() => envValidation(dotenv)).toThrow(EnvValidationError);
      });
    });

    describe('when there is no env variable value missing', () => {
      it('does nothing', () => {
        const dotenv = {
          error: null,
          parsed: { AMQP_HOST: '127.0.0.1:5672' },
        };

        expect(() => envValidation(dotenv)).not.toThrow(EnvValidationError);
      });
    });
  });
});
