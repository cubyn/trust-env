import { EntryKey } from '../types';

export class ResultNotFoundError extends Error {
  constructor(key: EntryKey) {
    super(`process.env.${key} not found and no default given`);

    this.name = this.constructor.name;
    this.key = key;

    Error.captureStackTrace(this, this.constructor);
  }
}
