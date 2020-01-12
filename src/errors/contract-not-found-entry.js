module.exports = class CarotteEnvContractNotFoundEntry extends Error {
  constructor(contract, variable) {
    super(`Variable ${variable} not found in contract`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.variable = variable;

    Error.captureStackTrace(this, this.constructor);
  }
};
