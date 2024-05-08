const { MESSAGE } = require("../constants/message");
const STATUS = require("../constants/status");

class ErrorWithStatus {
  constructor({ message, status }) {
    this.message = message;
    this.status = status;
  }
}

class EntityError extends ErrorWithStatus {
  constructor({ message = MESSAGE.VALIDATION_ERROR, errors }) {
    super({ message, status: STATUS.UNPROCESSABLE_ENTITY });
    this.errors = errors;
  }
}

module.exports = { ErrorWithStatus, EntityError };
