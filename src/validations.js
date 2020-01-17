const isJs = require('is_js');
const {
  ContractNotFoundError,
  EntryDefaultTypeNotValidError,
  EntryNotUniqueError,
  EntryNotValidError,
  ProcessEnvNotFoundError,
} = require('./errors');
require('./types');

const assertContractExists = (contract) => {
  if (isJs.empty(contract)) {
    throw new ContractNotFoundError();
  }
};

const assertUniqueEntries = (contract) => {
  const duplicates = contract
    .map(({ key }) => key)
    .reduce((acc, element, i, arr) => {
      if (arr.indexOf(element) !== i && acc.includes(element)) {
        acc.push(element);
      }

      return acc;
    }, []);

  if (duplicates.length) {
    throw new EntryNotUniqueError(contract, duplicates);
  }
};
const assertValidEntries = (contract) => {
  contract.forEach((entry) => {
    const { key, type, defaultValue, validator } = entry;

    if (isJs.any.falsy(key, type)) {
      throw new EntryNotValidError(entry);
    }

    if (defaultValue && isJs.not[type](defaultValue)) {
      // TODO extends EntryNotValidError
      throw new EntryDefaultTypeNotValidError(defaultValue, type);
    }

    if (validator) {
      // TODO injects value in validator function
      // TODO test validator
      if (!validator(entry)) {
        // TODO extends EntryNotValidError
        throw new EntryNotValidError();
      }
    }
  });
};

const assertProcessEnvExists = (processEnv) => {
  if (isJs.empty(processEnv)) {
    throw new ProcessEnvNotFoundError();
  }
};

module.exports = {
  assertContractExists,
  assertValidEntries,
  assertUniqueEntries,
  assertProcessEnvExists,
};
