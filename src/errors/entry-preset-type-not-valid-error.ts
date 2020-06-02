import { Entry } from '../types';

export class EntryPresetTypeNotValidError extends Error {
  entry: Entry;

  constructor(entry: Entry) {
    super(`Entry ${entry.key} with preset ${entry.preset} has not the expected type ${entry.type}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
}
