const isJs = require('is_js');

const { slice } = Array.prototype;

const integersArray = (value) => {
  const isArray = isJs.array(value) && isJs.integer(value[0]);

  if (isArray) {
    if (value.length > 1) {
      return isJs.sameType(...value);
    }

    return true;
  }

  return false;
};

isJs.integersArray = integersArray;

const getParams = (args) => {
  let params = slice.call(args);
  const { length } = params;

  if (length === 1 && isJs.array(params[0])) {
    [params] = params;
  }

  return params;
};

// https://github.com/arasatasaygin/is.js/blob/master/is.js#L44

// Helper function which reverses the sense of predicate result
const not = (func) => {
  return function notFn() {
    return !func(...arguments);
  };
};

// Helper function which call predicate function per parameter and return true if all pass
const all = (func) => {
  return function allFn() {
    return !getParams(arguments).some(param => !func(param));
  };
};

// Helper function which call predicate function per parameter and return true if any pass
const any = (func) => {
  return function anyFn() {
    return getParams(arguments).some(func);
  };
};

// https://github.com/arasatasaygin/is.js/blob/master/is.js#L874
const setInterfaces = () => {
  const OPTIONS = ['integersArray'];

  OPTIONS.forEach((option) => {
    isJs.not[option] = not(isJs[option]);
    isJs.all[option] = all(isJs[option]);
    isJs.any[option] = any(isJs[option]);
  });
};

setInterfaces();
