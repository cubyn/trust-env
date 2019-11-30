module.exports = class ProcessEnvError extends Error {
  constructor(key) {
    super(`Missing or incorrectly formatted process.env.${key}`);
    // Name of the error is the same as the class name
    this.name = this.constructor.name;
    // Clips the constructor invocation from the stack trace.
    // Stack trace a little nicer
    Error.captureStackTrace(this, this.constructor);
  }
};
