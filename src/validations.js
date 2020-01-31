const isJs = require('is_js');
const { ContractNotFoundError, EntryNotUniqueError } = require('./errors');
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

// const assertTypeValue = (entry, value) => {
//   const { type } = entry;

//   if (isJs.not[type](value)) {
//     throw new EntryNotValidError(entry);
//   }
// };

module.exports = {
  assertContractExists,
  assertUniqueEntries,
};
