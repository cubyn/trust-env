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

const validateType = declaration => isJs[declaration.type](process.env[declaration.variable]);

const validate = (contract) => {
  const validations = contract.map((declaration) => {
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

// module.exports = (contract, { logger = console } = { logger: console }) => {
module.exports = {
  validate,
};
