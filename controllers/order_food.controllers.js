const { FOOD, ORDER_FOOD, RESTAURANT } = require("../constants/message");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const restaurantServices = require("../services/restaurant.services");
const orderFoodServices = require("../services/order_food.services");
const orderFoodListServices = require("../services/order_food_list.services");
const foodServices = require("../services/food.services");
const userServices = require("../services/user.services");
const updateOrderFood = async (req, res) => {
  let { food_id } = req.body,
    quantity = req.foodQuantityOrder;
  let newOrderFoodList,
    updateOrderFoodList,
    deleteOrderFoodList,
    currentOrderFoodList,
    total_price,
    pendingUserOrderRestaurant;
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
      newOrderFood = newOrderFood.toObject();
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
      if (quantity <= 0) {
        deleteOrderFoodList = await orderFoodListServices.deleteOrderFoodList(
          req.orderComponent._id.toString()
        );
        if (req.currentOrderFoodList.length === 1) {
          const deleteOrderFood = orderFoodServices.deleteOrderFood(
            req.orderComponent.order_food_menu_id.toString()
          );
        }
      }
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

const getAllUserOrderFood = async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 100;
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
const getAllRestaurantsPlacedOrderFood = async (req, res) => {
  const restaurants = await restaurantServices.findAllUserRestaurants(
    req.user._id
  );
  if (restaurants.length === 0)
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  var restaurantWithOrders = [];
  for (var restaurant of restaurants) {
    const orders = await orderFoodServices.getAllOrdersByRestaurant({
      restaurant_id: restaurant._id,
      status: { $ne: 0 },
    });
    if (orders.length === 0) continue;
    restaurant = restaurant.toObject();
    var modifiedOrders = await Promise.all(
      orders.map(async (data) => {
        data = data.toObject();
        const user = await userServices.getUserFromId(data.user_id);
        data.username = user.username;
        data.phone_number = user.phone_number;
        return data;
      })
    );
    restaurant.orders = modifiedOrders;
    restaurantWithOrders.push(restaurant);
  }
  res.json({
    message: ORDER_FOOD.FOUND,
    restaurants: restaurantWithOrders,
  });
};
const getOrderFoodHost = async (req, res) => {
  const { id } = req.params;
  var orderFood = await orderFoodServices.findOrderById(id);
  if (!orderFood)
    throw new ErrorWithStatus({
      message: ORDER_FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  orderFood = orderFood.toObject();
  const user = await userServices.getUserFromId(orderFood.user_id);
  orderFood.username = user.username;
  orderFood.phone_number = user.phone_number;
  const orderFoodList = await orderFoodListServices.findFoodByOrder(id);
  if (orderFoodList.length === 0)
    throw new ErrorWithStatus({
      message: ORDER_FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  res.json({ message: ORDER_FOOD.FOUND, orderFood, orderFoodList });
};
const updateHostOrderFood = async (req, res) => {
  const { order_food_id, status } = req.body;
  const updateOrderFood = await orderFoodServices.updateOrderFood(
    order_food_id,
    { status }
  );

  res.json({
    message: ORDER_FOOD.UPDATE_SUCCESS,
    orderFood: updateOrderFood,
  });
};
const cancelOrderFood = async (req, res) => {
  const { order_food_id, status } = req.body;
  const updateOrderFood = await orderFoodServices.updateOrderFood(
    order_food_id,
    status
  );

  res.json({
    message: ORDER_FOOD.CANCEL_SUCCESS,
    orderFood: updateOrderFood,
  });
};
module.exports = {
  updateOrderFood,
  getOrderFood,
  getAllUserOrderFood,
  placeAnOrder,
  getAllRestaurantsPlacedOrderFood,
  getOrderFoodHost,
  updateHostOrderFood,
  cancelOrderFood,
};
