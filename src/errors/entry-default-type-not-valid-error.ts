import { EntryKey } from '../types';

export class EntryPresetTypeNotValidError extends Error {
  constructor(key: EntryKey, preset, type) {
    super(`Entry ${key} with preset: ${preset} has not expected type (${type} expected)`);

    this.name = this.constructor.name;
    this.key = key;
    this.preset = preset;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
}
