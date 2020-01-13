module.exports = class EntryNotFoundError extends Error {
  constructor(contract, key) {
    super(`Key ${key} not found in contract`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.key = key;

    Error.captureStackTrace(this, this.constructor);
  }
};
