module.exports = class EntryNotUniqueError extends Error {
  constructor(contract, keys) {
    super(`Entries with keys: ${keys} not uniques`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.keys = keys;

    Error.captureStackTrace(this, this.constructor);
  }
};
