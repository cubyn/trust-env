module.exports = class EntryNotFoundError extends Error {
  constructor(contract, key) {
    super(`Entry with key: ${key} not found`);

    this.name = this.constructor.name;
    this.contract = contract;
    this.key = key;

    Error.captureStackTrace(this, this.constructor);
  }
};
