const { ResultNotFoundError } = require('./errors');
const {
  findDeclaration,
  getDeclaredEnvVariables,
  sanitizeDeclaration,
  transformComposedType,
} = require('./utils');
const {
  assertContractExists,
  assertEntriesValidation,
  assertNoDuplicatesEntries,
  assertProcessEnvExists,
} = require('./validations');

// TODO const { DB_HOST } = require('env');
// TODO Throws if required declarations props are not found
// TODO add types stringsArray, numbersArray
// TODO default as function
// TODO Give a type make it required? No (e.g: type null or undefined)
// TODO transform()
// TODO validate process.env.key is the right type
// TODO Required is not compatible several types (e.g: null or undfined)
// TODO validate by type or validate function if exists
// TODO env.push({ key: `DB_PASSWORD` }) (dynamically created)

let contract = [];
let processEnv = {};
const COMPOSED_TYPES = [
  'integersArray',
];

const config = (contractParam) => {
  assertContractExists(contractParam);

  contract = contractParam.map(sanitizeDeclaration);

  assertNoDuplicatesEntries(contract);
  assertEntriesValidation(contract);

  processEnv = getDeclaredEnvVariables(contract);
};

/**
 * Return variable from cached process.env
 *
 * No need to run again validations: cached process.env is already validated
 */
const get = (keys) => {
  assertProcessEnvExists(processEnv);

  const processKey = (key) => {
    const { type, defaultValue, transform } = findDeclaration(contract, key);
    let result = processEnv[key] || defaultValue;

    if (!result) {
      throw new ResultNotFoundError(key);
    }

    if (COMPOSED_TYPES.includes(type)) {
      result = transformComposedType(type, result);
    }

    if (transform) {
      return transform(result);
    }

    return result;
  };

  if (Array.isArray(keys)) {
    return keys.reduce((acc, key) => {
      acc[key] = processKey(key);

      return acc;
    }, {});
  }

  return processKey(keys);
};

module.exports = {
  config,
  get,
};
