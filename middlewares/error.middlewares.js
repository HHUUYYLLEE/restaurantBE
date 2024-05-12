const { omit } = require("lodash");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");

const defaultErrorHander = (err, req, res, next) => {
  // console.log(req.fileIDs);
  // console.log(err);
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ["status"]));
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, {
      enumerable: true,
    });
  });
  res.status(STATUS.BAD_REQUEST).json({
    message: err.message,
    errorInfo: omit(err, ["stack"]),
  });
};

module.exports = defaultErrorHander;
