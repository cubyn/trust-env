const { ProcessEnvError } = require('./errors');

module.exports = ({ error, parsed }) => {
  if (error) {
    throw new Error(error);
  }

  Object.entries(parsed).forEach(([key, value]) => {
    if (!value) {
      throw new ProcessEnvError(key);
    }
  });
};
