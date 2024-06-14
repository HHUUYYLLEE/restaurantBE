const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const STATUS = require("../constants/status");
const {
  FOOD,
  USER,
  ORDER_FOOD,
  RESTAURANT,
  ORDER_TABLE,
} = require("../constants/message");
const { envConfig } = require("../constants/config");
const orderFoodServices = require("../services/order_food.services");
const orderFoodListServices = require("../services/order_food_list.services");
const { ErrorWithStatus } = require("../utils/errors");
const foodServices = require("../services/food.services");
const restaurantServices = require("../services/restaurant.services");
const orderTableServices = require("../services/order_table.services");
const orderTableFormValidator = validate(
  checkSchema({
    restaurant_id: {
      notEmpty: true,
      isLength: {
        options: { max: 160 },
      },
      trim: true,
    },
    date: {
      notEmpty: true,
    },
    table_chair: {
      notEmpty: true,
    },
  }),
  ["body"]
);
const orderTableValidator = async (req, res, next) => {
  const { restaurant_id } = req.body;
  const orderTable =
    await orderTableServices.findRestaurantAndUserOrderTablePair({
      restaurant_id,
      user_id: req.user._id,
      status: 1,
    });
  if (orderTable)
    return next(
      new ErrorWithStatus({
        message: ORDER_TABLE.EXISTED,
        status: STATUS.BAD_REQUEST,
      })
    );
  return next();
};

const cancelOrderTableFormValidator = validate(
  checkSchema({
    order_table_id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["body"]
);
const cancelOrderTableValidator = async (req, res, next) => {
  const orderTable = await orderTableServices.findTableOrderAndUserPair(
    req.user._id,
    req.body.order_table_id
  );
  if (!orderTable)
    return next(
      new ErrorWithStatus({
        message: ORDER_TABLE.NOT_FOUND,
        status: STATUS.BAD_REQUEST,
      })
    );
  else if (orderTable.status !== 1)
    return next(
      new ErrorWithStatus({
        message: ORDER_TABLE.INVALID_REQUEST,
        status: STATUS.BAD_REQUEST,
      })
    );
  return next();
};

const getAllOrdersTableValidator = async (req, res, next) => {
  return next();
  //to be continued
};

const getOrderTableFormValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["params"]
);
const getOrderTableValidator = async (req, res, next) => {
  const { id } = req.params;
  const orderTable = await orderTableServices.findTableOrderAndUserPair(
    id,
    req.user._id
  );
  if (!orderTable)
    return next(
      new ErrorWithStatus({
        message: ORDER_TABLE.NOT_FOUND,
        status: STATUS.NOT_FOUND,
      })
    );
  return next();
};

const getOrderTableHostValidator = async (req, res, next) => {
  const { id } = req.params;
  const order = await orderTableServices.findTableOrderById(id);
  if (!order)
    return next(
      new ErrorWithStatus({
        message: ORDER_TABLE.NOT_FOUND,
        status: STATUS.NOT_FOUND,
      })
    );
  const restaurant = await restaurantServices.getRestaurant(
    order.restaurant_id
  );
  if (req.user._id.toString() !== restaurant.user_id.toString())
    next(
      new ErrorWithStatus({
        message: RESTAURANT.NOT_FOUND,
        status: STATUS.UNAUTHORIZED,
      })
    );
  return next();
};
const updateOrderTableHostFormValidator = validate(
  checkSchema({
    order_table_id: {
      notEmpty: true,
      trim: true,
    },
    status: {
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) === 2 || parseInt(value) === 3) return true;
          else throw new Error(ORDER_TABLE.INVALID_REQUEST);
        },
      },
    },
  }),
  ["body"]
);
const updateOrderTableHostValidator = async (req, res, next) => {
  const { order_table_id } = req.body;
  const order = await orderTableServices.findTableOrderById(order_table_id);
  if (!order)
    return next(
      new ErrorWithStatus({
        message: ORDER_TABLE.NOT_FOUND,
        status: STATUS.NOT_FOUND,
      })
    );
  const restaurant = await restaurantServices.getRestaurant(
    order.restaurant_id
  );
  if (req.user._id.toString() !== restaurant.user_id.toString())
    next(
      new ErrorWithStatus({
        message: RESTAURANT.NOT_FOUND,
        status: STATUS.UNAUTHORIZED,
      })
    );
  return next();
};
const tokenValidatingResult = async (req, res, next) => {
  if (req.user === undefined)
    return next(
      new ErrorWithStatus({
        message: USER.LOGIN_REQUIRED,
        status: STATUS.UNAUTHORIZED,
      })
    );
  return next();
};
module.exports = {
  orderTableValidator,
  tokenValidatingResult,
  orderTableFormValidator,
  cancelOrderTableFormValidator,
  cancelOrderTableValidator,
  getAllOrdersTableValidator,
  getOrderTableValidator,
  getOrderTableFormValidator,
  getOrderTableHostValidator,
  updateOrderTableHostFormValidator,
  updateOrderTableHostValidator,
};
