import { EntryKey } from '../types';

export class EntryDefaultTypeNotValidError extends Error {
  constructor(key: EntryKey, preset, type) {
    super(`Entry ${key} with default: ${preset} has not expected type (${type} expected)`);

    this.name = this.constructor.name;
    this.key = key;
    this.preset = preset;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
}
