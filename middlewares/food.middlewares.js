const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const { FOOD } = require("../constants/message");
const foodImageValidator = function (req, res, next) {
  //   console.log(typeof req.file);
  if (req.file === undefined) throw new Error(FOOD.INVALID_REQUEST);
  console.log(req.file);
  if (typeof req.file === "object") {
    if (req.file.fieldname !== "image") throw new Error(FOOD.INVALID_REQUEST);
    next();
  }
};
const createFoodValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isLength: {
        options: { max: 160 },
      },
      trim: true,
    },
    desc: {
      notEmpty: true,
      isLength: {
        options: { max: 1000 },
      },
      trim: true,
    },
    restaurant_id: {
      notEmpty: true,
      trim: true,
    },
    status: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (value === "0" || value === "1") return true;
          else throw new Error(FOOD.INVALID_REQUEST);
        },
      },
      trim: true,
    },
    price: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) > 0) return true;
          else throw new Error(FOOD.INVALID_REQUEST);
        },
      },
      trim: true,
    },
    quantity: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 0) return true;
          else throw new Error(FOOD.INVALID_REQUEST);
        },
      },
      trim: true,
    },
  }),
  ["body"]
);
const getAllFoodValidator = validate(
  checkSchema({
    search: {
      optional: true,
      trim: true,
    },
    page: {
      optional: true,
      trim: true,
    },
    limit: {
      optional: true,
      trim: true,
    },
  }),
  ["query"]
);
const getAllFoodInRestaurantValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
    page: {
      optional: true,
      trim: true,
    },
    limit: {
      optional: true,
      trim: true,
    },
  }),
  ["query"]
);
const getFoodValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["params"]
);

module.exports = {
  createFoodValidator,
  getAllFoodInRestaurantValidator,
  getAllFoodValidator,
  foodImageValidator,
  getFoodValidator,
};
