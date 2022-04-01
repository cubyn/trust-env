import { CastType, Entry } from '..';

export class EntryValidatorNotSucceededError extends Error {
  entry: Entry<string, CastType>;

  constructor(entry: Entry<string, CastType>) {
    super(`Entry validator not succeeded: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
