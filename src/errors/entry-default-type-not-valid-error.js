module.exports = class EntryDefaultTypeNotValidError extends Error {
  constructor(key, defaultValue, type) {
    super(`Entry ${key} with default: ${defaultValue} has not expected type (${type} expected)`);

    this.name = this.constructor.name;
    this.key = key;
    this.defaultValue = defaultValue;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
};
