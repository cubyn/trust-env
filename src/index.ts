import { assertEntriesPresence, assertEntriesUnicity, extractEnvVariables } from './utils';

export type Variables<T = any> = T & {
  [key: string]: any;
};

export type TrustEnvLib<T = any> = Variables<T> & {
  get: any;
  getPrefix: any;
};

type EntryFnParams = {
  value: any;
  entry: Entry;
  contract: Contract;
  isJs: Is;
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

export type Entry = {
  key: string;
  type: CastType;
  required?: boolean;
  preset?: string;
  validator?: ({ value, entry, contract, isJs }: EntryFnParams) => boolean;
  transform?: ({ value, entry, contract, isJs }: EntryFnParams) => any;
};

export type Contract = Entry[];

export default <T = any>(contract: Contract): TrustEnvLib<T> => {
  assertEntriesPresence(contract);
  assertEntriesUnicity(contract);
  const VARIABLES = extractEnvVariables(contract);

  return {
    get: get(VARIABLES),
    getPrefix: getPrefix(VARIABLES),
    ...VARIABLES,
  };
};

const get = (variables: Variables) => (keys: string | string[]): string | Variables => {
  if (Array.isArray(keys)) {
    return keys.reduce((acc, key) => {
      acc[key] = variables[key];

      return acc;
    }, {} as Variables);
  }

  return variables[keys];
};

const getPrefix = (variables: Variables) => (prefix: string): Variables => {
  const variablesEntries = Object.entries(variables);

  return variablesEntries.reduce((acc, [key, value]) => {
    if (key.startsWith(prefix)) {
      acc[key] = value;
    }

    return acc;
  }, {} as Variables);
};
