module.exports = class EntryTransformNotFunctionError extends Error {
  constructor(entry) {
    super(`Entry transform not a function: ${JSON.stringify(entry, null, 2)}`);

    this.name = this.constructor.name;
    this.entry = entry;

    Error.captureStackTrace(this, this.constructor);
  }
};
