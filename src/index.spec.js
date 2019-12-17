const { ProcessEnvError } = require('./errors');
const envValidation = require('.');

describe('src/index.js', () => {
  describe('when there is env variable missing value', () => {
    it('throws with ProcessEnvError', () => {
      expect(() => envValidation({ AMQP_HOST: null }))
        .toThrow(ProcessEnvError);
    });
  });

  describe('when there is env variable empty value', () => {
    it('throws with ProcessEnvError', () => {
      expect(() => envValidation({ AMQP_HOST: '' }))
        .toThrow(ProcessEnvError);
    });
  });

  describe('when there is no env variable missing value', () => {
    it('does nothing', () => {
      expect(() => envValidation({ AMQP_HOST: '127.0.0.1:5672' }))
        .not.toThrow();
    });
  });
});
