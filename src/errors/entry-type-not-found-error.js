module.exports = class EntryTypeNotFoundError extends Error {
  constructor(entry) {
    super(`Entry type not found: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
};
