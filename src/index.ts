import { assertEntriesPresence, assertEntriesUnicity, extractEnvVariables } from './utils';

type EntryFnParams<K extends string, T extends CastType> = {
  value: CastTypeToPrimitive[T];
  entry: Entry<K, T>;
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

export type CastTypeToPrimitive = {
  boolean: boolean;
  date: Date;
  integer: number;
  integersArray: number[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  json: object;
  number: number;
  numbersArray: number[];
  string: string;
  stringsArray: string[];
};
// There will be an error on the following line if there's a missing CastType in CastTypeToPrimitive
type _check = CastTypeToPrimitive[CastType];

export type Entry<K extends string, T extends CastType> = {
  key: K;
  type: T;
  required?: boolean;
  preset?: string;
  defaultValue?: CastTypeToPrimitive[T];
  // FIXME: type inference for the type parameters of these function's parameters does not work during declaration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator?: ({ value, entry, contract, isJs }: EntryFnParams<K, any>) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: ({ value, entry, contract, isJs }: EntryFnParams<K, any>) => any;
};

export type Contract = readonly Entry<string, CastType>[];

export type ContractVariables<C extends Contract> = {
  [Key in ContractKeys<C>]: EntryTypeByKey<C, Key>;
};

export type ContractKeys<C extends Contract> = C[number]['key'];

type EntryTypeByKey<C extends Contract, Key extends ContractKeys<C>> = CastTypeToPrimitive[Extract<
  C[number],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entry<Key, any>
>['type']];

export type TrustEnvLib<C extends Contract> = ContractVariables<C> & {
  get: GetEntryValue<C>;
  getPrefix: GetEntryValueByPrefix<C>;
};

export default <C extends Contract>(contract: Narrow<C>): TrustEnvLib<C> => {
  const castContract = contract as Contract;
  assertEntriesPresence(castContract);
  assertEntriesUnicity(castContract);
  const VARIABLES = extractEnvVariables(contract as C);

  return {
    get: get(VARIABLES),
    getPrefix: getPrefix(VARIABLES),
    ...VARIABLES,
  };
};

// This function has two modes:
// - get(key: string) => returns the value of process.env[key], properly typed
// - get(keys: string[]) => returns a subset of TrustEnvLib, only containing the keys included in `keys`
export type GetEntryValue<C extends Contract> = <
  KeyQuery extends ContractKeys<C>[] | ContractKeys<C>
>(
  key: KeyQuery,
) => KeyQuery extends ContractKeys<C>[]
  ? {
      // key is an array => return a { [key]: value } map
      [EntryKey in KeyQuery[number]]: EntryTypeByKey<C, EntryKey>;
    }
  : // key is a string => just return the value
    EntryTypeByKey<C, Cast<KeyQuery, ContractKeys<C>>>;

const get = <C extends Contract>(variables: ContractVariables<C>): GetEntryValue<C> => (
  keys: ContractKeys<C> | ContractKeys<C>[],
) => {
  const isArray = <T>(t: T[] | T): t is T[] => Array.isArray(t);
  if (isArray(keys)) {
    return keys.reduce((acc, key) => {
      acc[key] = variables[key];

      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as ContractVariables<C>) as any; // Conditional return types can be hard to satisfy
  }

  return variables[keys];
};

// Return a subset of ContractVariables<C>, only containing the keys starting with the input string
export type GetEntryValueByPrefix<C extends Contract> = <PrefixQuery extends string>(
  prefix: PrefixQuery,
) => WithoutNever<
  {
    [Key in C[number]['key']]: Key extends `${PrefixQuery}${string}`
      ? EntryTypeByKey<C, Key>
      : never;
  }
>;

const getPrefix = <C extends Contract>(
  variables: ContractVariables<C>,
): GetEntryValueByPrefix<C> => <K extends string>(
  prefix: K,
): ReturnType<GetEntryValueByPrefix<C>> => {
  const variablesEntries = Object.entries(variables);

  return variablesEntries.reduce((acc, [key, value]: [ContractKeys<C>, unknown]) => {
    if (key.startsWith(prefix)) {
      acc[key] = value;
    }

    return acc;
  }, {} as ContractVariables<C>);
};

// Type utils

type NonNeverKeys<T, K extends keyof T = keyof T> = K extends unknown
  ? T[K] extends never
    ? never
    : K
  : never;

type WithoutNever<T> = {
  [K in NonNeverKeys<T>]: T[K];
};

// Careful with this trick, it cheats with TS type resolution. It is required in some cases
// due to the extensive usage of generics and inference, but do not abuse it.
type Cast<A, B> = A extends B ? A : B;

// These Narrow types are some pretty cool TS magic. It allows a function to receive precisely typed parameters, as if they had
// been declared with an `as const` modifier.
// Example:
// declare function control<T extends object>(param: T): T;
// declare function narrow<T extends object>(param: Narrow<T>): T;
// const controlRes = control([1, 'a', { key: 'value' }]); // `controlRes` type is inferred as `(number | string | { key: string })[]`
// const narrowRes = narrow([1, 'a', { key: 'value' }]); // `narrowRes` type is inferred as `[1, 'a', { key: 'value' }]`
type Narrow<A> = Cast<A, NarrowRecursively<A>>;

type NarrowRecursively<A> =
  | (A extends (...args: infer Params) => infer Return ? (...args: Params) => Return : never)
  | (A extends string | number | bigint | boolean | null | undefined ? A : never)
  | { [K in keyof A]: NarrowRecursively<A[K]> };
