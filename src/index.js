const { ProcessEnvError } = require('./errors');

module.exports = (variables) => {
  Object.entries(variables).forEach(([key, value]) => {
    if (!value) {
      throw new ProcessEnvError(key);
    }
  });
};
