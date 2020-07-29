import { Entry } from '..';

export class EntryValueNotFoundError extends Error {
  entry: Entry;

  constructor(entry: Entry) {
    super(`process.env.${entry.key} value not found`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
