/* eslint-disable @typescript-eslint/no-explicit-any */
import isJs from 'is_js';

type Scalar = 'string' | 'number' | 'integer' | 'boolean';

interface IsStaticTrustEnv extends IsStatic {
  stringsArray: (value: any) => boolean;
  numbersArray: (value: any) => boolean;
  integersArray: (value: any) => boolean;
  booleansArray: (value: any) => boolean;
}

interface IsStaticApiTrustEnv extends IsStaticApi {
  stringsArray: (value: any) => boolean;
  numbersArray: (value: any) => boolean;
  integersArray: (value: any) => boolean;
  booleansArray: (value: any) => boolean;
}

interface IsTrustEnv extends Is {
  stringsArray: (value: any) => boolean;
  numbersArray: (value: any) => boolean;
  integersArray: (value: any) => boolean;
  booleansArray: (value: any) => boolean;
  not: IsStaticTrustEnv;
  any: IsStaticApiTrustEnv;
  all: IsStaticApiTrustEnv;
}

const COMPOSED_ARRAY_TYPES: Scalar[] = ['string', 'number', 'integer', 'boolean'];

/**
 * Returns a function to validate composed array types (e.g: stringsArray)
 */
const scalarArrayTypeBuilder = (scalarType: Scalar) => (value: any) => {
  if (!isJs.array(value)) {
    return false;
  }

  const isJsFn = isJs[scalarType];
  const isFirstExpectedType = isJsFn(value[0]);

  if (!isFirstExpectedType) {
    return false;
  }

  const isExpectedType = value.every((item: any) => isJsFn(item));

  if (!isExpectedType) {
    return false;
  }

  return true;
};

const getParams = (args: any) => {
  let params = Array.prototype.slice.call(args);

  if (params.length === 1 && isJs.array(params[0])) {
    [params] = params;
  }

  return params;
};

// https://github.com/arasatasaygin/is.js/blob/master/is.js#L44

// Helper function which reverses the sense of predicate result
const not = (func: (arg0: any) => any) =>
  function notFn(args: any) {
    return !func(args);
  };

// Helper function which call predicate function per parameter and return true if all pass
const all = (func: (arg0: any) => any) =>
  function allFn(args: any) {
    return !getParams(args).some((param) => !func(param));
  };

// Helper function which call predicate function per parameter and return true if any pass
const any = (func: (value: any, index: number, array: any[]) => unknown) =>
  function anyFn(args: any) {
    return getParams(args).some(func);
  };

const isJsComposedTypes = COMPOSED_ARRAY_TYPES.reduce((acc, type) => {
  const arrayType = `${type}sArray`;
  acc[arrayType] = scalarArrayTypeBuilder(type);

  // https://github.com/arasatasaygin/is.js/blob/master/is.js#L874
  acc.not[arrayType] = not(acc[arrayType]);
  acc.all[arrayType] = all(acc[arrayType]);
  acc.any[arrayType] = any(acc[arrayType]);

  return acc;
}, isJs as any);

const isJsForTrustEnv: IsTrustEnv = {
  ...isJs,
  ...isJsComposedTypes,
};

export default isJsForTrustEnv;
