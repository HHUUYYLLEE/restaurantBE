const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const STATUS = require("../constants/status");
const { FOOD, USER, ORDER_FOOD, RESTAURANT } = require("../constants/message");
const { envConfig } = require("../constants/config");
const orderFoodServices = require("../services/order_food.services");
const orderFoodListServices = require("../services/order_food_list.services");
const { ErrorWithStatus } = require("../utils/errors");
const foodServices = require("../services/food.services");
const restaurantServices = require("../services/restaurant.services");
const tokenValidatingResult = async (req, res, next) => {
  if (req.user === undefined || req.user.role === 1)
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

  if (!/^\-?([1-9]\d*)$/.test(quantity)) {
    return next(
      new ErrorWithStatus({
        message: ORDER_FOOD.INVALID_REQUEST,
        status: STATUS.BAD_REQUEST,
      })
    );
  }

  let currentOrderFoodList;
  if (food) {
    quantity = parseInt(quantity);
    let pendingUserOrderRestaurant =
      await orderFoodServices.findPendingOrderInRestaurantByUser(
        req.user._id,
        food.restaurant_id
      );
    if (!pendingUserOrderRestaurant) {
      if (quantity < 0)
        return next(
          new ErrorWithStatus({
            message: ORDER_FOOD.INVALID_REQUEST,
            status: STATUS.BAD_REQUEST,
          })
        );

      req.foodQuantityOrder = quantity;
      req.restaurant_id = food.restaurant_id;
      req.food_price = food.price;
      req.controlmode = 1;
      return next();
    }
    pendingUserOrderRestaurant = pendingUserOrderRestaurant.toJSON();
    req.order_food_menu_id = pendingUserOrderRestaurant._id.toString();
    currentOrderFoodList =
      await orderFoodListServices.findOrderByFoodAndOrderPair(
        req.order_food_menu_id,
        food_id
      );
    if (currentOrderFoodList.length === 0) {
      if (quantity < 0)
        return next(
          new ErrorWithStatus({
            message: ORDER_FOOD.INVALID_REQUEST,
            status: STATUS.BAD_REQUEST,
          })
        );

      req.foodQuantityOrder = quantity;
      req.controlmode = 2;
      return next();
    }
    //   console.log(currentOrderFoodList[0]._id.toString());
    currentOrderFoodList = await orderFoodListServices.findFoodByOrder(
      pendingUserOrderRestaurant._id.toString()
    );
    for (const orderComponent of currentOrderFoodList) {
      if (food_id === orderComponent.food_id.toString()) {
        req.foodQuantityOrder = orderComponent.quantity + quantity;
        req.controlmode = 3;
        req.orderComponent = orderComponent;
        req.pendingUserOrderRestaurant = pendingUserOrderRestaurant;
        req.currentOrderFoodList = currentOrderFoodList;
        return next();
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
      notEmpty: true,
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
const getOrderFoodHostValidator = async (req, res, next) => {
  const { id } = req.params;
  const order = await orderFoodServices.findOrderById(id);
  if (!order)
    return next(
      new ErrorWithStatus({
        message: ORDER_FOOD.NOT_FOUND,
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
const updateOrderFoodHostFormValidator = validate(
  checkSchema({
    order_food_id: {
      notEmpty: true,
      trim: true,
    },
    status: {
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) === 4 || parseInt(value) === 3) return true;
          else throw new Error(ORDER_FOOD.INVALID_REQUEST);
        },
      },
    },
  }),
  ["body"]
);
const updateOrderFoodHostValidator = async (req, res, next) => {
  const { order_food_id } = req.body;
  const order = await orderFoodServices.findOrderById(order_food_id);
  if (!order)
    return next(
      new ErrorWithStatus({
        message: ORDER_FOOD.NOT_FOUND,
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
const cancelOrderFoodFormValidator = validate(
  checkSchema({
    order_food_id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["body"]
);
const cancelOrderFoodValidator = async (req, res, next) => {
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
  else if (orderFood.status !== 1)
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
  getOrderFoodHostValidator,
  updateOrderFoodHostValidator,
  updateOrderFoodHostFormValidator,
  cancelOrderFoodFormValidator,
  cancelOrderFoodValidator,
};
