module.exports = class EntryValidatorNotSucceededError extends Error {
  constructor(entry) {
    super(`Entry validator not succeeded: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
};
