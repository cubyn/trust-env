module.exports = class ProcessEnvNotFoundError extends Error {
  constructor() {
    super('process.env not found');

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
};
