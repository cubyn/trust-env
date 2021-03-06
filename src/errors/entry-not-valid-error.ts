import { Entry } from '..';

export class EntryNotValidError extends Error {
  entry: Entry;

  constructor(entry: Entry) {
    super(`Entry not valid: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
