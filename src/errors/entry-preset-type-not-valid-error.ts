import { EntryKey, EntryPreset } from '../types';

export class EntryPresetTypeNotValidError extends Error {
  key: EntryKey;
  preset: EntryPreset;
  type: string;

  constructor(key: EntryKey, preset: EntryPreset, type: string) {
    super(`Entry ${key} with preset ${preset} has not the expected type ${type}`);

    this.name = this.constructor.name;
    this.key = key;
    this.preset = preset;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
}
