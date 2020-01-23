const {
  sanitizeEntry,
  extractEnvVariables,
} = require('./utils');
const {
  assertContractExists,
  assertValidEntries,
  assertUniqueEntries,
} = require('./validations');

// TODO Get by prefix
// TODO Give a type make it required? No (e.g: type null or undefined)
// TODO default as function
// TODO Required is not compatible several types (e.g: null or undefined)
// TODO env.push({ key: `DB_PASSWORD` }) (dynamically created)

const config = ({ contract } = {}) => {
  assertContractExists(contract);

  const CONTRACT = contract.map(sanitizeEntry);

  assertUniqueEntries(CONTRACT);

  // Retrieved before their are validated
  const VARIABLES = extractEnvVariables(CONTRACT);

  assertValidEntries(CONTRACT, VARIABLES);

  return {
    get: get(VARIABLES),
    ...module.exports,
    ...VARIABLES,
  };
};

const get = variables => (keys) => {
  if (Array.isArray(keys)) {
    return keys.reduce((acc, key) => {
      acc[key] = variables[key];

      return acc;
    }, {});
  }

  return variables[keys];
};

module.exports = { config };
