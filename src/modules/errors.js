const { assert, ServerError } = require('@devcubyn/core.errors');

class EnvValidationError extends ServerError {
  constructor(key) {
    super(`Missing or incorrectly formatted environment variable [${key}]`);
  }
}

module.exports = {
  assert,
  EnvValidationError,
};
