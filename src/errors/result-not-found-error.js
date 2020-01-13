module.exports = class ResultNotFoundError extends Error {
  constructor(variable) {
    super(`process.env.${variable} not found and no default given`);

    this.name = this.constructor.name;
    this.variable = variable;

    Error.captureStackTrace(this, this.constructor);
  }
};
