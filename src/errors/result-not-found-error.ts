import { EntryKey } from '../types';

export class ResultNotFoundError extends Error {
  constructor(key: EntryKey) {
    super(`process.env.${key} not found and no preset given`);

    this.name = this.constructor.name;
    this.key = key;

    Error.captureStackTrace(this, this.constructor);
  }
}
