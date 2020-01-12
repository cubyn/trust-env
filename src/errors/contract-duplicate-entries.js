module.exports = class CarotteEnvContractDuplicateEntries extends Error {
  constructor(contract, entries) {
    super(`Duplicate entries in contract: ${entries}`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.entries = entries;

    Error.captureStackTrace(this, this.constructor);
  }
};
