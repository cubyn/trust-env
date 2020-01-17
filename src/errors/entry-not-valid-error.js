module.exports = class EntryNotValidError extends Error {
  constructor(entry) {
    super(`Entry not valid: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
};
