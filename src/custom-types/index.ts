import isJs from 'is_js';

type ScalarType = string | number | boolean;

const COMPOSED_ARRAY_TYPES = ['string', 'integer', 'number'];

/**
 * Returns a function to validate composed array types (e.g: stringsArray)
 */
const scalarArrayTypeBuilder = (scalarType: ScalarType) => (value: any) => {
  const isArray = isJs.array(value) && isJs[scalarType](value[0]);

  if (!isArray) {
    return false;
  }

  if (value.length > 1) {
    return isJs.sameType(...value);
  }

  return true;
};

const getParams = (args) => {
  let params = Array.prototype.slice.call(args);

  if (params.length === 1 && isJs.array(params[0])) {
    [params] = params;
  }

  return params;
};

// https://github.com/arasatasaygin/is.js/blob/master/is.js#L44

// Helper function which reverses the sense of predicate result
const not = (func) =>
  function notFn(args) {
    return !func(args);
  };

// Helper function which call predicate function per parameter and return true if all pass
const all = (func) =>
  function allFn(args) {
    return !getParams(args).some((param) => !func(param));
  };

// Helper function which call predicate function per parameter and return true if any pass
const any = (func) =>
  function anyFn(args) {
    return getParams(args).some(func);
  };

COMPOSED_ARRAY_TYPES.forEach((type) => {
  const composedTypeName = `${type}sArray`;

  isJs[composedTypeName] = scalarArrayTypeBuilder(type);
  // https://github.com/arasatasaygin/is.js/blob/master/is.js#L874
  isJs.not[composedTypeName] = not(isJs[composedTypeName]);
  isJs.all[composedTypeName] = all(isJs[composedTypeName]);
  isJs.any[composedTypeName] = any(isJs[composedTypeName]);
});
