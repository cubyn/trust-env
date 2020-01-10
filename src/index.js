const isJs = require('is_js');

// TODO not possible to have both default and required options
// const CONTRACT = [{
//   variable: 'DB_HOST',
//   type: 'string',
//   // required: true,
//   // default: '',
//   // Called at runtime only
//   // Option to call it each time
//   // validate: () => {},
//   // Call each time
//   // transform: () => {},
// }];

let contract = [];

const isValid = () => true;

const validateType = declaration => isJs[declaration.type](process.env[declaration.variable]);

// TODO variable must be unique
const findByVariable = variable => contract.find(declaration => declaration.variable === variable);

// TODO freeze contract?
const config = (contractParam) => {
  contract = contractParam;

  return module.exports;
};

const validate = () => {
  if (!contract || !contract.length) {
    throw new Error();
  }

  const validations = contract.map((declaration) => {
    if (!isValid(declaration)) {
      throw new Error();
    }

    if (declaration.type) {
      return validateType(declaration);
    }

    if (declaration.validate) {
      return declaration.validate(declaration);
    }

    // TODO Custom error
    throw new Error();
  });

  const allValid = validations.every(validation => validation === true);

  if (allValid) {
    return allValid;
  }

  throw new Error(validations);
};

const get = (variable) => {
  if (!contract || !contract.length) {
    throw new Error();
  }

  const declaration = findByVariable(variable);

  if (!declaration) {
    throw new Error();
  }

  if (!isValid(declaration)) {
    throw new Error();
  }

  const value = process.env[variable];

  if (!value) {
    if (declaration.default) {
      return declaration.default;
    }

    throw new Error();
  }

  return value;
};

// module.exports = (contract, { logger = console } = { logger: console }) => {
module.exports = {
  config,
  validate,
  get,
};
