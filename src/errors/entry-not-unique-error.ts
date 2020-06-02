import { Contract, EntryKey } from '../types';

export class EntryNotUniqueError extends Error {
  contract: Contract;
  keys: EntryKey[];

  constructor(contract: Contract, keys: EntryKey[]) {
    super(`Entries with keys: ${keys} are not uniques`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.keys = keys;

    Error.captureStackTrace(this, this.constructor);
  }
}
