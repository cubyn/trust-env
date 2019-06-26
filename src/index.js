const { assert, ServerError, EnvValidationError } = require('./modules/errors');

module.exports = ({ error, parsed }) => {
  assert(!error, ServerError, error);

  Object.entries(parsed).forEach(([key, value]) => {
    assert(value, EnvValidationError, key);
  });
};
