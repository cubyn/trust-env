import isJs from './custom-types';
import { ContractNotFoundError } from './errors/contract-not-found-error';
import { EntryKeyNotFoundError } from './errors/entry-key-not-found-error';
import { EntryNotUniqueError } from './errors/entry-not-unique-error';
import { EntryPresetTypeNotValidError } from './errors/entry-preset-type-not-valid-error';
import { EntryTypeNotFoundError } from './errors/entry-type-not-found-error';
import { EntryValidatorNotSucceededError } from './errors/entry-validator-not-succeeded-error';
import { EntryValueNotFoundError } from './errors/entry-value-not-found-error';
import { Contract, CastType, EntryKey, Variables, Options } from './types';

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
      throw new Error(`Cannot cast ${value} into ${type}`);
  }
};

const extractEnvVariables = (contract: Contract, options: Options) =>
  contract.reduce((acc, entry) => {
    const { key, type, preset, transform, validator } = entry;

    if (isJs.falsy(key)) {
      throw new EntryKeyNotFoundError(entry);
    }

    if (isJs.falsy(type)) {
      throw new EntryTypeNotFoundError(entry);
    }

    if (preset && isJs.not.sameType(type, preset)) {
      throw new EntryPresetTypeNotValidError(entry);
    }

    let rawValue = process.env[key];

    if (!rawValue) {
      if (options.strict) {
        throw new EntryValueNotFoundError(entry);
      }

      if (preset) {
        rawValue = preset;
      } else {
        throw new EntryValueNotFoundError(entry);
      }
    }

    let value = castToType(rawValue as string, type);

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

export { assertEntriesUnicity, assertEntriesPresence, extractEnvVariables };
