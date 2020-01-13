module.exports = class DuplicateEntriesError extends Error {
  constructor(contract, variables) {
    super(`Duplicate entries found in contract for ${variables}`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.variables = variables;

    Error.captureStackTrace(this, this.constructor);
  }
};
