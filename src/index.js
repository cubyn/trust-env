const { ResultNotFoundError } = require('./errors');
const {
  findDeclaration,
  sanitizeDeclaration,
  transformComposedType,
} = require('./utils');
const {
  assertContractExists,
  assertEntriesValidation,
  assertNoDuplicatesEntries,
} = require('./validations');

// TODO add types stringsArray, numbersArray
// TODO default as function
// TODO Give a type make it required? No (e.g: type null or undefined)
// TODO transform()
// TODO validate process.env.key is the right type
// TODO Required is not compatible several types (e.g: null or undfined)
// TODO get(['A', 'B'])
// TODO validate by type or validate function if exists
// TODO env.push({ key: `DB_PASSWORD` })

let contract = [];
const COMPOSED_TYPES = [
  'integersArray',
];

const config = (contractParam) => {
  assertContractExists(contractParam);

  contract = contractParam.map(sanitizeDeclaration);

  assertNoDuplicatesEntries(contract);
  assertEntriesValidation(contract);
};

const get = (key) => {
  const { type, defaultValue, transform } = findDeclaration(contract, key);
  let result = process.env[key] || defaultValue;

  if (result) {
    if (COMPOSED_TYPES.includes(type)) {
      result = transformComposedType(type, result);
    }

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
