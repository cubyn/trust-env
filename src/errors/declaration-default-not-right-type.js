module.exports = class DeclarationDefaultNotRightType extends Error {
  constructor(defaultValue, type) {
    super(`Default ${defaultValue} is not the right type (${type})`);

    this.name = this.constructor.name;
    this.defaultValue = defaultValue;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
};
