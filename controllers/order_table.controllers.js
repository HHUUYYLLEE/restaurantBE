const {
  FOOD,
  ORDER_FOOD,
  RESTAURANT,
  ORDER_TABLE,
} = require("../constants/message");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const restaurantServices = require("../services/restaurant.services");
const orderFoodServices = require("../services/order_food.services");
const orderFoodListServices = require("../services/order_food_list.services");
const foodServices = require("../services/food.services");
const userServices = require("../services/user.services");
const orderTableServices = require("../services/order_table.services");

const createOrderTable = async (req, res) => {
  const { restaurant_id, table_chair, date } = req.body;
  const newOrderTable = await orderTableServices.createOrderTable({
    user_id: req.user._id,
    restaurant_id,
    table_chair,
    date,
    memo: "",
    status: 1,
  });
  if (!newOrderTable)
    throw new ErrorWithStatus({
      message: ORDER_TABLE.NOT_CREATED,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  res.json({ message: ORDER_TABLE.CREATE_SUCCESS, orderTable: newOrderTable });
};

const getOrderTable = async (req, res) => {
  const { id } = req.params;
  const orderTable = await orderTableServices.findTableOrderAndUserPair(
    id,
    req.user._id
  );
  if (!orderTable)
    throw new ErrorWithStatus({
      message: ORDER_TABLE.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  const restaurant = await restaurantServices.getRestaurant(
    orderTable.restaurant_id
  );
  res.json({ message: ORDER_TABLE.FOUND, orderTable, restaurant });
};

const getAllUserOrderTable = async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 100;
  const { allUserOrders, totalPages } =
    await orderTableServices.getAllUserTableOrders(req.user._id, page, limit);
  if (allUserOrders.length === 0) {
    throw new ErrorWithStatus({
      message: ORDER_TABLE.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({
    message: ORDER_TABLE.FOUND,
    orderTable: allUserOrders,
    totalPages,
    page,
    limit,
  });
};

const getAllRestaurantsPlacedOrderTable = async (req, res) => {
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
    const orders = await orderTableServices.getAllTableOrdersByRestaurant({
      restaurant_id: restaurant._id,
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
    message: ORDER_TABLE.FOUND,
    restaurants: restaurantWithOrders,
  });
};
const getOrderTableHost = async (req, res) => {
  const { id } = req.params;
  var orderTable = await orderTableServices.findTableOrderById(id);
  if (!orderTable)
    throw new ErrorWithStatus({
      message: ORDER_TABLE.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  orderTable = orderTable.toObject();
  const user = await userServices.getUserFromId(orderTable.user_id);
  orderTable.username = user.username;
  orderTable.phone_number = user.phone_number;
  res.json({ message: ORDER_TABLE.FOUND, orderTable });
};
const updateHostOrderTable = async (req, res) => {
  const { order_table_id, status } = req.body;
  const updateOrderTable = await orderTableServices.updateOrderTable(
    order_table_id,
    { status }
  );

  res.json({
    message: ORDER_TABLE.UPDATE_SUCCESS,
    orderFood: updateOrderTable,
  });
};
const cancelOrderTable = async (req, res) => {
  const { order_table_id } = req.body;
  const updateOrderTable = await orderTableServices.updateOrderTable(
    order_table_id,
    { status: 2 }
  );

  res.json({
    message: ORDER_TABLE.CANCEL_SUCCESS,
    orderFood: updateOrderTable,
  });
};
module.exports = {
  createOrderTable,
  getOrderTable,
  getAllUserOrderTable,
  getAllRestaurantsPlacedOrderTable,
  getOrderTableHost,
  updateHostOrderTable,
  cancelOrderTable,
};
