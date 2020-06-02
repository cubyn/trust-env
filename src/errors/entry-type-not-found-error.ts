import { Entry } from '../types';

export class EntryTypeNotFoundError extends Error {
  entry: Entry;

  constructor(entry: Entry) {
    super(`Type not found in entry: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
