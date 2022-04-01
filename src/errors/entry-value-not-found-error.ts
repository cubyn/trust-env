import { CastType, Entry } from '..';

export class EntryValueNotFoundError extends Error {
  entry: Entry<string, CastType>;

  constructor(entry: Entry<string, CastType>) {
    super(`process.env.${entry.key} value not found`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
