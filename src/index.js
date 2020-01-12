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

const validateDefaultType = declaration => isJs[declaration.type](declaration.default);

const validateValueType = ({ type, variable }) => isJs[type](process.env[variable]);

const findByVariable = (variable) => {
  const declarations = contract.filter(declaration => declaration.variable === variable);

  if (declarations.length > 1) {
    throw new errors.CarotteEnvContractDuplicateEntries(contract, declarations);
  } else if (declarations.length === 0) {
    throw new errors.CarotteEnvContractNotFoundEntry(contract, variable);
  }

  return declarations[0];
};

const assertDeclarationValid = (declaration) => {
  const defaultRightType = validateDefaultType(declaration);

  // Default is not the same type as declared type
  if (declaration.default && !defaultRightType) {
    throw new Error();
  }
};

const validate = (contractParam) => {
  contract = contractParam;

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

  const declaration = findByVariable(variable);

  // TODO validate by type or validate function if exists
  // if (!validateValueType(declaration)) {
  //   throw new Error();
  // }

  const envValue = process.env[declaration.variable];
  const result = envValue || declaration.default;

  if (result) {
    return result;
  }

  throw new Error();
};

module.exports = {
  validate,
  getEnv: get,
};
