export type TrustEnvLib = {
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

type EntryFnParams = {
  value: any;
  entry: Entry;
  contract: Contract;
  isJs: Is;
};

export type Entry = {
  key: EntryKey;
  type: CastType;
  preset?: any;
  validator?: ({ value, entry, contract, isJs }: EntryFnParams) => boolean;
  transform?: ({ value, entry, contract, isJs }: EntryFnParams) => any;
};

export type Contract = Entry[];

export type Variables = {
  [key: string]: any;
};
