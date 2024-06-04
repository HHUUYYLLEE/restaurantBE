const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const drive = require("../utils/googledrivecre");
const STATUS = require("../constants/status");
const stream = require("stream");
const { FOOD, USER } = require("../constants/message");
const { envConfig } = require("../constants/config");
const restaurantServices = require("../services/restaurant.services");
const { ErrorWithStatus } = require("../utils/errors");
const foodServices = require("../services/food.services")
const tokenValidatingResult = async (req, res, next) => {
  if (req.user === undefined)
    return next(
      new ErrorWithStatus({
        message: USER.LOGIN_REQUIRED,
        status: STATUS.UNAUTHORIZED,
      })
    );
  return next()
};

const findFoodValidator = async(req,res,next){
    const food = await foodServices.getFood(
        req.body.food_id
      );
      if (food) return next();
      return next(
        new ErrorWithStatus({
          message: FOOD.NOT_FOUND,
          status: STATUS.BAD_REQUEST,
        })
      );
}

const createOrderFoodValidator = validate(
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
  }),
  ["body"]
);
const getAllOrderFoodValidator = async(req,res,next){
    return next()
    //to be continued
}
  
const getOrderFoodValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["params"]
);

module.exports = {
  createOrderFoodValidator,
  getAllOrderFoodValidator,
  tokenValidatingResult,
  getOrderFoodValidator,
  findFoodValidator,
};
