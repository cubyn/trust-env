const { ProcessEnvError } = require('./errors');

module.exports = ({ parsed }) => {
  Object.entries(parsed).forEach(([key, value]) => {
    if (!value) {
      throw new ProcessEnvError(key);
    }
  });
};
