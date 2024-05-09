const { omit } = require("lodash");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const fs = require("fs");

const defaultErrorHander = (err, req, res, next) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ["status"]));
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, {
      enumerable: true,
    });
  });
  res.status(STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ["stack"]),
  });
};

module.exports = defaultErrorHander;
