import { assertEntriesPresence, assertEntriesUnicity, extractEnvVariables } from './utils';
import { Contract, TrustEnvLib, Variables } from './types';

export = (contract: Contract): TrustEnvLib => {
  assertEntriesPresence(contract);
  assertEntriesUnicity(contract);
  const VARIABLES = extractEnvVariables(contract);

  return {
    get: get(VARIABLES),
    getPrefix: getPrefix(VARIABLES),
    ...VARIABLES,
  };
};

const get = (variables: any) => (keys: any) => {
  if (Array.isArray(keys)) {
    return keys.reduce((acc, key) => {
      acc[key] = variables[key];

      return acc;
    }, {});
  }

  return variables[keys];
};

const getPrefix = (variables: any) => (prefix: any) => {
  const variablesEntries = Object.entries(variables);

  return variablesEntries.reduce((acc, [key, value]) => {
    if (key.startsWith(prefix)) {
      acc[key] = value;
    }

    return acc;
  }, {} as Variables);
};
