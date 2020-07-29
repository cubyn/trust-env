import { Entry } from '..';

export class EntryTransformNotFunctionError extends Error {
  entry: Entry;

  constructor(entry: Entry) {
    super(`Entry transform is not a function: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
