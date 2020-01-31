module.exports = class EntryKeyNotFoundError extends Error {
  constructor(entry) {
    super(`Entry key not found: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
};
