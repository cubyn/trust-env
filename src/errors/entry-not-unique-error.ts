import { Contract, EntryKey } from '../types';

export class EntryNotUniqueError extends Error {
  constructor(contract: Contract, keys: EntryKey[]) {
    super(`Entries with keys: ${keys} not uniques`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.keys = keys;

    Error.captureStackTrace(this, this.constructor);
  }
}
