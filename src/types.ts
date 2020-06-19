export type Variables = {
  [key: string]: any;
};

export type TrustEnvLib = Variables & {
  get: any;
  getPrefix: any;
};

export type CastType =
  | 'boolean'
  | 'date'
  | 'integer'
  | 'integersArray'
  | 'json'
  | 'number'
  | 'numbersArray'
  | 'string'
  | 'stringsArray';

export type EntryKey = string;

export type EntryPreset = any;

type EntryFnParams = {
  value: any;
  entry: Entry;
  contract: Contract;
  isJs: Is;
};

export type Entry = {
  key: EntryKey;
  type: CastType;
  preset?: EntryPreset;
  validator?: ({ value, entry, contract, isJs }: EntryFnParams) => boolean;
  transform?: ({ value, entry, contract, isJs }: EntryFnParams) => any;
};

export type Contract = Entry[];

export type Options = {
  strict: boolean;
};
