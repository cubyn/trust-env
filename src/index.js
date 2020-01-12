const isJs = require('is_js');
const errors = require('./errors');

// TODO Give a type make it required?
//   No (e.g: type null or undefined)
// TODO transform()
// TODO variable must be unique in contract
// TODO Required is not compatible several types (e.g: null or undfined)

// Type is required
//
// Value is not found:
//   if type === undefined => OK
//   else => KO

let contract = [];

const validateDefaultType = ({ type, defaultValue }) => isJs[type](defaultValue);

const validateValueType = ({ type, variable }) => isJs[type](process.env[variable]);

const findByVariable = (variable) => {
  const declarations = contract.filter(declaration => declaration.variable === variable);

  if (declarations.length > 1) {
    throw new errors.ContractDuplicateEntries(contract, declarations);
  } else if (declarations.length === 0) {
    throw new errors.ContractNotFoundEntry(contract, variable);
  }

  return declarations[0];
};

const assertDeclarationValid = (declaration) => {
  const defaultRightType = validateDefaultType(declaration);

  // Default is not the same type as declared type
  if (declaration.defaultValue && !defaultRightType) {
    throw new errors.DeclarationDefaultNotRightType(declaration.default, declaration.type);
  }
};

const config = (contractParam) => {
  // "default" keyword is annoying to works with
  // Internally renames in "defaultValue"
  contract = contractParam.map(({ variable, type, default: defaultValue, validate, transform }) => ({
    variable,
    type,
    validate,
    transform,
    defaultValue,
  }));

  const declarationsValidations = contract.map((declaration) => {
    assertDeclarationValid(declaration);

    if (declaration.validate) {
      return declaration.validate(declaration);
    }

    return true;
  });

  const allValid = declarationsValidations.every(validation => validation === true);

  if (!allValid) {
    throw new Error();
  }
};

const get = (variable) => {
  if (!contract || !contract.length) {
    throw new Error();
  }

  const { defaultValue } = findByVariable(variable);

  // TODO validate by type or validate function if exists
  // if (!validateValueType(declaration)) {
  //   throw new Error();
  // }
  const envValue = process.env[variable];
  const result = envValue || defaultValue;

  if (result) {
    return result;
  }

  throw new Error();
};

module.exports = {
  config,
  getEnv: get,
};
