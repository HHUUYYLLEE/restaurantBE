const { FOOD, ORDER_FOOD } = require("../constants/message");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const restaurantServices = require("../services/restaurant.services");
const orderFoodServices = require("../services/order_food.services");
const orderFoodListServices = require("../services/order_food_list.services");
const foodServices = require("../services/food.services");
const updateOrderFood = async (req, res) => {
  let { food_id, quantity } = req.body;
  let newOrderFoodList,
    updateOrderFoodList,
    deleteOrderFoodList,
    currentOrderFoodList,
    total_price,
    pendingUserOrderRestaurant;
  quantity = parseInt(quantity);
  switch (req.controlmode) {
    case 1:
      let newOrderFood = await orderFoodServices.createOrderFood({
        user_id: req.user._id,
        restaurant_id: req.restaurant_id,
        memo: "",
        status: 0,
        total_price: req.food_price * quantity,
        address: "",
        lat: "",
        lng: "",
      });
      if (!newOrderFood)
        throw new ErrorWithStatus({
          message: ORDER_FOOD.NOT_CREATED,
          status: STATUS.INTERNAL_SERVER_ERROR,
        });
      newOrderFood = newOrderFood.toJSON();
      newOrderFoodList = await orderFoodListServices.createOrderFoodList({
        food_id: food_id,
        order_food_menu_id: newOrderFood._id,
        quantity: quantity,
      });
      if (!newOrderFoodList) {
        await orderFoodServices.deleteOrderFood(newOrderFood._id);
        throw new ErrorWithStatus({
          message: ORDER_FOOD.NOT_CREATED,
          status: STATUS.INTERNAL_SERVER_ERROR,
        });
      }
      res.json({
        message: ORDER_FOOD.CREATE_SUCCESS,
        order_food: newOrderFood,
        order_food_list: newOrderFoodList,
      });
      break;
    case 2:
      newOrderFoodList = await orderFoodListServices.createOrderFoodList({
        food_id: food_id,
        order_food_menu_id: req.order_food_menu_id,
        quantity: quantity,
      });
      if (!newOrderFoodList) {
        throw new ErrorWithStatus({
          message: ORDER_FOOD.NOT_CREATED,
          status: STATUS.INTERNAL_SERVER_ERROR,
        });
      }
      currentOrderFoodList = await orderFoodListServices.findFoodByOrder(
        req.order_food_menu_id
      );
      total_price = 0;
      for (foodData of currentOrderFoodList) {
        const food = await foodServices.getFood(foodData.food_id.toString());
        total_price += parseInt(foodData.quantity) * parseInt(food.price);
      }
      pendingUserOrderRestaurant = await orderFoodServices.updateOrderFood(
        req.order_food_menu_id,
        { total_price }
      );
      res.json({
        message: ORDER_FOOD.CREATE_SUCCESS,
        order_food: pendingUserOrderRestaurant,
        order_food_list: newOrderFoodList,
      });
      break;
    case 3:
      updateOrderFoodList = await orderFoodListServices.updateOrderFoodList(
        req.orderComponent._id.toString(),
        { quantity: quantity }
      );
      currentOrderFoodList = await orderFoodListServices.findFoodByOrder(
        req.order_food_menu_id
      );
      total_price = 0;
      for (foodData of currentOrderFoodList) {
        const food = await foodServices.getFood(foodData.food_id.toString());
        total_price += parseInt(foodData.quantity) * parseInt(food.price);
      }
      pendingUserOrderRestaurant = await orderFoodServices.updateOrderFood(
        req.order_food_menu_id,
        { total_price }
      );
      res.json({
        message: ORDER_FOOD.UPDATE_SUCCESS,
        order_food: pendingUserOrderRestaurant,
        order_food_list: updateOrderFoodList,
      });
      break;
    case 4:
      deleteOrderFoodList = await orderFoodListServices.deleteOrderFoodList(
        req.orderComponent._id.toString()
      );
      if (req.currentOrderFoodList.length === 1) {
        const deleteOrderFood = orderFoodServices.deleteOrderFood(
          req.orderComponent.order_food_menu_id.toString()
        );
      } else {
        currentOrderFoodList = await orderFoodListServices.findFoodByOrder(
          req.order_food_menu_id
        );
        total_price = 0;
        for (foodData of currentOrderFoodList) {
          const food = await foodServices.getFood(foodData.food_id.toString());
          total_price += parseInt(foodData.quantity) * parseInt(food.price);
        }
        pendingUserOrderRestaurant = await orderFoodServices.updateOrderFood(
          req.order_food_menu_id,
          { total_price }
        );
      }
      res.json({ message: ORDER_FOOD.DELETE_SUCCESS });
      break;
    default:
      res.json({ message: "temp" });
      break;
  }
};

const getOrderFood = async (req, res) => {
  const { id } = req.params;
  const orderFood = await orderFoodServices.findOrderAndUserPair(
    req.user._id,
    id
  );
  if (!orderFood)
    throw new ErrorWithStatus({
      message: ORDER_FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });

  const orderFoodList = await orderFoodListServices.findFoodByOrder(id);
  if (orderFoodList.length === 0)
    throw new ErrorWithStatus({
      message: ORDER_FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  res.json({ message: ORDER_FOOD.FOUND, orderFood, orderFoodList });
};

const getAllOrderFood = async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const { allUserOrders, totalPages } =
    await orderFoodServices.getAllUserOrders(req.user._id, page, limit);
  if (allUserOrders.length === 0) {
    throw new ErrorWithStatus({
      message: ORDER_FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({
    message: ORDER_FOOD.FOUND,
    orderFood: allUserOrders,
    totalPages,
    page,
    limit,
  });
};
const placeAnOrder = async (req, res) => {
  const { order_food_id, address, lat, lng } = req.body;
  let total_price = 0;
  const orderFoodList = await orderFoodListServices.findFoodByOrder(
    order_food_id
  );
  for (const foodOrder of orderFoodList) {
    const food = await foodServices.getFood(foodOrder.food_id);
    total_price += food.price * foodOrder.quantity;
  }
  const updateOrderFood = await orderFoodServices.updateOrderFood(
    order_food_id,
    { address, lat, lng, total_price, status: 1 }
  );

  res.json({
    message: ORDER_FOOD.PLACE_SUCCESS,
    orderFood: updateOrderFood,
    orderFoodList,
  });
};
module.exports = {
  updateOrderFood,
  getOrderFood,
  getAllOrderFood,
  placeAnOrder,
};
