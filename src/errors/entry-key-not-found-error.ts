import { CastType, Entry } from '..';

export class EntryKeyNotFoundError extends Error {
  entry: Entry<string, CastType>;

  constructor(entry: Entry<string, CastType>) {
    super(`Key not found in entry: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
