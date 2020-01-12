module.exports = class CarotteEnvContractNotFound extends Error {
  constructor() {
    super('Contract not found');

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
};
