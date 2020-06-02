import { Contract, EntryKey } from '../types';

export class EntryNotFoundError extends Error {
  contract: Contract;
  key: EntryKey;

  constructor(contract: Contract, key: EntryKey) {
    super(`Entry with key: ${key} not found`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.key = key;

    Error.captureStackTrace(this, this.constructor);
  }
}
