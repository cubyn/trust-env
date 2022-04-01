import { CastType, Entry } from '..';

export class EntryNotValidError extends Error {
  entry: Entry<string, CastType>;

  constructor(entry: Entry<string, CastType>) {
    super(`Entry not valid: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
