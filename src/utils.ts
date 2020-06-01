import isJs from 'is_js';
import { ContractNotFoundError } from './errors/contract-not-found-error';
import { EntryNotUniqueError } from './errors/entry-not-unique-error';
import { EntryKeyNotFoundError } from './errors/entry-key-not-found-error';
import { EntryTypeNotFoundError } from './errors/entry-type-not-found-error';
import { EntryValidatorNotSucceededError } from './errors/entry-validator-not-succeeded-error';
import { Contract, Entry, CastType, EntryKey, Variables } from './types';
import './custom-types';

const assertEntriesPresence = (contract: Contract) => {
  if (isJs.not.existy(contract) || isJs.empty(contract)) {
    throw new ContractNotFoundError();
  }
};

const assertEntriesUnicity = (contract: Contract) => {
  const duplicates = contract
    .map(({ key }) => key)
    .reduce((acc, key, i, arr) => {
      if (arr.indexOf(key) !== i && !acc.includes(key)) {
        acc.push(key);
      }

      return acc;
    }, [] as EntryKey[]);

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

const sanitizeEntry = (entry: Entry): Entry => ({
  key: entry.key,
  type: entry.type,
  preset: entry.preset,
  validator: entry.validator,
  transform: entry.transform,
});

const castToType = (value: string, type: CastType) => {
  switch (type) {
    case 'stringsArray':
      return value.split(',').map((item) => item.toString());
    case 'integersArray':
      return value.split(',').map((item) => parseInt(item, 10));
    case 'numbersArray':
      return value.split(',').map((item) => parseFloat(item));
    case 'string':
      return value.toString();
    case 'integer':
      return parseInt(value, 10);
    case 'number':
      return parseFloat(value);
    case 'boolean':
      return Boolean(value);
    case 'date':
      return new Date(value);
    case 'json':
      return JSON.parse(value);
    default:
      throw new Error();
  }
};

const extractEnvVariables = (contract: Contract) =>
  contract.reduce((acc, entry) => {
    const { key, type, preset, transform, validator } = entry;

    if (isJs.falsy(key)) {
      throw new EntryKeyNotFoundError(entry);
    }

    if (isJs.falsy(type)) {
      throw new EntryTypeNotFoundError(entry);
    }

    let rawValue = process.env[key];

    if (!rawValue) {
      if (preset) {
        rawValue = preset;
      } else {
        throw new Error(`process.env.${key} not found and no preset given`);
      }
    }

    let value = castToType(rawValue, type);

    if (transform) {
      value = transform({ value, entry, contract, isJs });
    }

    if (validator) {
      if (isJs.not.truthy(validator({ value, entry, contract, isJs }))) {
        throw new EntryValidatorNotSucceededError(entry);
      }
    }

    acc[key] = value;

    return acc;
  }, {} as Variables);

export { assertEntriesUnicity, assertEntriesPresence, sanitizeEntry, extractEnvVariables };
