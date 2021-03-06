import { Entry } from '..';

export class EntryKeyNotFoundError extends Error {
  entry: Entry;

  constructor(entry: Entry) {
    super(`Key not found in entry: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
