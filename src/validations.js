const isJs = require('is_js');
const {
  ContractNotFoundError,
  EntryDefaultTypeNotValidError,
  EntryNotUniqueError,
  EntryNotValidError,
} = require('./errors');
require('./types');

const assertContractExists = (contract) => {
  if (isJs.not.existy(contract) || isJs.empty(contract)) {
    throw new ContractNotFoundError();
  }
};

const assertUniqueEntries = (contract) => {
  const duplicates = contract
    .map(({ key }) => key)
    .reduce((acc, element, i, arr) => {
      if (arr.indexOf(element) !== i && !acc.includes(element)) {
        acc.push(element);
      }

      return acc;
    }, []);

  if (duplicates.length) {
    throw new EntryNotUniqueError(contract, duplicates);
  }
};

const assertValidEntries = (contract, variables) => {
  contract.forEach((entry) => {
    const { key, type, validator, defaultValue } = entry;

    if (isJs.falsy(key)) {
      throw new EntryNotValidError(entry);
    }

    if (isJs.all.falsy(type, validator) || isJs.all.truthy(type, validator)) {
      throw new EntryNotValidError(entry);
    }

    if (validator) {
      if (isJs.not.function(validator)) {
        throw new EntryNotValidError(entry);
      }

      const value = variables[entry.key];

      if (isJs.not.truthy(validator({ value, entry, contract, isJs }))) {
        throw new EntryNotValidError(entry);
      }
    }

    if (defaultValue && isJs.not[type](defaultValue)) {
      // TODO extends EntryNotValidError
      throw new EntryDefaultTypeNotValidError(key, defaultValue, type);
    }
  });
};

module.exports = {
  assertContractExists,
  assertValidEntries,
  assertUniqueEntries,
};
