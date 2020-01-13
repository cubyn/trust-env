module.exports = class DuplicateEntriesError extends Error {
  constructor(contract, keys) {
    super(`Duplicate entries found in contract for ${keys}`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.keys = keys;

    Error.captureStackTrace(this, this.constructor);
  }
};
