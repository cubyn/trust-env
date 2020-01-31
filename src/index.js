const { sanitizeEntryKeys, extractEnvVariables } = require('./utils');
const { assertContractExists, assertUniqueEntries } = require('./validations');

// TODO Test type cast (JSON, date, etc)
// TODO Test "required"
// TODO Give a type make it required? No (e.g: type null or undefined)
// TODO default as function
// TODO Required is not compatible with several types (e.g: null or undefined)

const config = (contract) => {
  assertContractExists(contract);

  const CONTRACT = contract.map(sanitizeEntryKeys);

  assertUniqueEntries(CONTRACT);

  const VARIABLES = extractEnvVariables(CONTRACT);

  return {
    get: get(VARIABLES),
    getPrefix: getPrefix(VARIABLES),
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

const getPrefix = variables => (prefix) => {
  const variablesEntries = Object.entries(variables);

  return variablesEntries.reduce((acc, [key, value]) => {
    if (key.startsWith(prefix)) {
      acc[key] = value;
    }

    return acc;
  }, {});
};

module.exports = { config };
