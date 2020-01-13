module.exports = class DefaultInvalidTypeError extends Error {
  constructor(defaultValue, type) {
    super(`Default ${defaultValue} is invalid type. ${type} expected`);

    this.name = this.constructor.name;
    this.defaultValue = defaultValue;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
};
