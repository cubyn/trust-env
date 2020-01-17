module.exports = class EntryDefaultTypeNotValidError extends Error {
  constructor(defaultValue, type) {
    super(`Entry default: ${defaultValue} is not valid (${type} expected)`);

    this.name = this.constructor.name;
    this.defaultValue = defaultValue;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
};
