import { Contract } from '..';

export class EntryNotUniqueError extends Error {
  contract: Contract;
  keys: string[];

  constructor(contract: Contract, keys: string[]) {
    super(`Entries with keys: ${keys} are not uniques`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.keys = keys;

    Error.captureStackTrace(this, this.constructor);
  }
}
