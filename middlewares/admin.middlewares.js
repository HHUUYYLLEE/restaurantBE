const { ErrorWithStatus } = require("../utils/errors");
const STATUS = require("../constants/status");
const { envConfig } = require("../constants/config");
const reviewServices = require("../services/review.services");
const userServices = require("../services/user.services");
const { REVIEW } = require("../constants/message");
const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const { USER } = require("../constants/message");
const tokenValidatingResult = async (req, res, next) => {
  if (req.user === undefined || req.user.role !== 1)
    return next(
      new ErrorWithStatus({
        message: USER.LOGIN_REQUIRED,
        status: STATUS.UNAUTHORIZED,
      })
    );

  return next();
};
const deleteReviewFormValidator = validate(
  checkSchema({
    review_id: {
      notEmpty: true,
      isLength: {
        options: { max: 160 },
      },
      trim: true,
    },
  }),
  ["body"]
);
const verifyBloggerFormValidator = validate(
  checkSchema({
    user_id: {
      notEmpty: true,
      isLength: {
        options: { max: 160 },
      },
      trim: true,
    },
    status: {
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (value === "1" || value === "3") return true;
          else throw new Error(USER.INVALID_REQUEST);
        },
      },
    },
  }),
  ["body"]
);
const modifyUserStatusFormValidator = validate(
  checkSchema({
    user_id: {
      notEmpty: true,
      isLength: {
        options: { max: 160 },
      },
      trim: true,
    },
    status: {
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (value === "0" || value === "1") return true;
          else throw new Error(USER.INVALID_REQUEST);
        },
      },
    },
  }),
  ["body"]
);
const deleteReviewValidator = async (req, res, next) => {
  const { review_id } = req.body;
  const review = await reviewServices.getReview(review_id);
  if (!review)
    return next(
      new ErrorWithStatus({
        message: REVIEW.NOT_FOUND,
        status: STATUS.NOT_FOUND,
      })
    );
  req.review = review;
  return next();
};
module.exports = {
  tokenValidatingResult,
  deleteReviewFormValidator,
  verifyBloggerFormValidator,
  modifyUserStatusFormValidator,
  deleteReviewValidator,
};
