const { ResultNotFoundError } = require('./errors');
const {
  assertContractExists,
  assertEntriesValidation,
  assertNoDuplicatesEntries,
} = require('./validations');
const {
  findDeclaration,
  sanitizeDeclaration,
} = require('./utils');

// TODO transform as function
// TODO default as function
// TODO multi type
// TODO Give a type make it required? No (e.g: type null or undefined)
// TODO transform()
// TODO validate process.env.key is the right type
// TODO Required is not compatible several types (e.g: null or undfined)
// TODO get(['A', 'B'])
// TODO validate by type or validate function if exists
// TODO env.push({ key: `DB_PASSWORD` })

let contract = [];

const config = (contractParam) => {
  assertContractExists(contractParam);

  contract = contractParam.map(sanitizeDeclaration);

  assertNoDuplicatesEntries(contract);
  assertEntriesValidation(contract);
};

const get = (key) => {
  const { defaultValue, transform } = findDeclaration(contract, key);

  const envValue = process.env[key];
  const result = envValue || defaultValue;

  if (result) {
    if (transform) {
      return transform(result);
    }

    return result;
  }

  throw new ResultNotFoundError(key);
};

module.exports = {
  config,
  get,
};
