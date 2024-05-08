const express = require("express");
const { validationResult } = require("express-validator");
const { ErrorWithStatus, EntityError } = require("./errors");
const STATUS = require("../constants/status");
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
const validate = (validation) => {
  return async (req, res, next) => {
    await validation.run(req);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorsObject = errors.mapped();
    const entityError = new EntityError({ errors: {} });
    for (const key in errorsObject) {
      const { msg } = errorsObject[key];
      if (
        msg instanceof ErrorWithStatus &&
        msg.status !== STATUS.UNPROCESSABLE_ENTITY
      ) {
        return next(msg);
      }
      entityError.errors[key] = errorsObject[key];
    }
    // console.log(errors.mapped());
    // console.log(entityError);
    next(entityError);
  };
};

module.exports = validate;
