import isJs from './custom-types';
import { ContractNotFoundError } from './errors/contract-not-found-error';
import { EntryKeyNotFoundError } from './errors/entry-key-not-found-error';
import { EntryNotUniqueError } from './errors/entry-not-unique-error';
import { EntryTypeNotFoundError } from './errors/entry-type-not-found-error';
import { EntryValidatorNotSucceededError } from './errors/entry-validator-not-succeeded-error';
import { EntryValueNotFoundError } from './errors/entry-value-not-found-error';
import { Contract, CastType, Variables } from '.';

const assertEntriesPresence = (contract: Contract): void => {
  if (isJs.not.existy(contract) || isJs.empty(contract)) {
    throw new ContractNotFoundError();
  }
};

const assertEntriesUnicity = (contract: Contract): void => {
  const duplicates = contract
    .map(({ key }) => key)
    .reduce((acc, key, i, arr) => {
      if (arr.indexOf(key) !== i && !acc.includes(key)) {
        acc.push(key);
      }

      return acc;
    }, [] as string[]);

  if (duplicates.length) {
    throw new EntryNotUniqueError(contract, duplicates);
  }
};

const castToType = (value: string, type: CastType) => {
  if (value === undefined) {
    return;
  }

  if (
    value === '' &&
    (type === 'stringsArray' || type === 'integersArray' || type === 'numbersArray')
  ) {
    return [];
  }

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
      if (value === 'false') {
        return false;
      }

      if (value === 'true') {
        return true;
      }
      break;
    case 'date':
      return new Date(value);
    case 'json':
      return JSON.parse(value);
    default:
      throw new Error(`Cannot cast ${value} into ${type}`);
  }
};

const extractEnvVariables = (contract: Contract): Variables =>
  contract.reduce((acc, entry) => {
    const { key, type, required, preset, transform, validator } = entry;
    const isRequired = required === false ? false : true;

    if (isJs.falsy(key)) {
      throw new EntryKeyNotFoundError(entry);
    }

    if (isJs.falsy(type)) {
      throw new EntryTypeNotFoundError(entry);
    }

    let rawValue = process.env[key];

    if (!rawValue) {
      if (isRequired) {
        throw new EntryValueNotFoundError(entry);
      }

      if (preset !== undefined) {
        rawValue = preset;
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
