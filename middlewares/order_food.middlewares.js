const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const STATUS = require("../constants/status");
const { FOOD, USER, ORDER_FOOD } = require("../constants/message");
const { envConfig } = require("../constants/config");
const orderFoodServices = require("../services/order_food.services");
const orderFoodListServices = require("../services/order_food_list.services");
const { ErrorWithStatus } = require("../utils/errors");
const foodServices = require("../services/food.services");
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

const findFoodValidator = async (req, res, next) => {
  let { food_id, quantity } = req.body;
  const food = await foodServices.getFood(food_id);
  if (food) {
    quantity = parseInt(quantity);

    let pendingUserOrderRestaurant =
      await orderFoodServices.findPendingOrderInRestaurantByUser(
        req.user._id,
        food.restaurant_id
      );
    if (!pendingUserOrderRestaurant) {
      if (quantity === 0)
        return next(
          new ErrorWithStatus({
            message: ORDER_FOOD.INVALID_REQUEST,
            status: STATUS.BAD_REQUEST,
          })
        );
      req.restaurant_id = food.restaurant_id;
      req.food_price = food.price;
      req.controlmode = 1;
      return next();
    }
    pendingUserOrderRestaurant = pendingUserOrderRestaurant.toJSON();
    req.order_food_menu_id = pendingUserOrderRestaurant._id.toString();
    let currentOrderFoodList = await orderFoodListServices.findOrderByFood(
      food_id
    );
    if (currentOrderFoodList.length === 0) {
      if (quantity === 0)
        return next(
          new ErrorWithStatus({
            message: ORDER_FOOD.INVALID_REQUEST,
            status: STATUS.BAD_REQUEST,
          })
        );
      req.controlmode = 2;
      return next();
    }
    //   console.log(currentOrderFoodList[0]._id.toString());
    currentOrderFoodList = await orderFoodListServices.findFoodByOrder(
      pendingUserOrderRestaurant._id.toString()
    );
    for (const orderComponent of currentOrderFoodList) {
      if (food_id === orderComponent.food_id.toString()) {
        if (quantity > 0) {
          req.controlmode = 3;
          req.orderComponent = orderComponent;
          req.pendingUserOrderRestaurant = pendingUserOrderRestaurant;
          return next();
        } else {
          req.controlmode = 4;
          req.orderComponent = orderComponent;
          req.pendingUserOrderRestaurant = pendingUserOrderRestaurant;
          req.currentOrderFoodList = currentOrderFoodList;
          return next();
        }
      }
    }
  }
  return next(
    new ErrorWithStatus({
      message: FOOD.NOT_FOUND,
      status: STATUS.BAD_REQUEST,
    })
  );
};

const createOrderFoodValidator = validate(
  checkSchema({
    food_id: {
      notEmpty: true,
      isLength: {
        options: { max: 160 },
      },
      trim: true,
    },
    quantity: {
      isNumeric: true,
      trim: true,
    },
  }),
  ["body"]
);
const getAllOrderFoodValidator = async (req, res, next) => {
  return next();
  //to be continued
};

const getOrderFoodValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["params"]
);
const placeOrderFoodValidatorForm = validate(
  checkSchema({
    order_food_id: {
      notEmpty: true,
      trim: true,
    },
    address: { notEmpty: true },
    lat: { notEmpty: true },
    lng: { notEmpty: true },
  }),
  ["body"]
);
const placeOrderFoodValidator = async (req, res, next) => {
  const orderFood = await orderFoodServices.findOrderAndUserPair(
    req.user._id,
    req.body.order_food_id
  );
  if (!orderFood)
    return next(
      new ErrorWithStatus({
        message: ORDER_FOOD.NOT_FOUND,
        status: STATUS.BAD_REQUEST,
      })
    );
  else if (orderFood.status !== 0)
    return next(
      new ErrorWithStatus({
        message: ORDER_FOOD.INVALID_REQUEST,
        status: STATUS.BAD_REQUEST,
      })
    );
  return next();
};

module.exports = {
  createOrderFoodValidator,
  getAllOrderFoodValidator,
  tokenValidatingResult,
  getOrderFoodValidator,
  findFoodValidator,
  placeOrderFoodValidator,
  placeOrderFoodValidatorForm,
};
