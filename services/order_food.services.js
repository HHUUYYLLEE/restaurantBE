const orderFoodModel = require("../models/order_food.schemas");
const mongoose = require("mongoose");
class OrderFoodServices {
  async createOrderFood(obj) {
    const newOrder = await orderFoodModel.create(obj);
    return newOrder;
  }
  async updateOrderFood(id, obj) {
    const updateOrderFood = await orderFoodModel.findByIdAndUpdate(id, obj, {
      new: true,
    });
    return updateOrderFood;
  }
  async deleteOrderFood(id) {
    const deletedOrderFood = orderFoodModel.findByIdAndDelete(id);
    return deletedOrderFood;
  }
  async findOrdersByUser(id) {
    const userOrders = orderFoodModel.find({ user_id: id });
    return userOrders;
  }
  async findOrderById(id) {
    const order = orderFoodModel.findById(id);
    return order;
  }
  async findPendingOrdersByUser(id) {
    const pendingUserOrders = orderFoodModel.find({
      user_id: id,
      status: 0,
    });
    return pendingUserOrders;
  }
  async findPendingOrderInRestaurantByUser(user_id, restaurant_id) {
    const pendingUserOrders = orderFoodModel.findOne({
      user_id: user_id,
      restaurant_id: restaurant_id,
      status: 0,
    });
    return pendingUserOrders;
  }
  async findOrderAndUserPair(user_id, order_id) {
    const orderAndUserPair = orderFoodModel.findOne({
      _id: order_id,
      user_id: user_id,
    });
    return orderAndUserPair;
  }
  async getAllUserOrders(id, page, limit) {
    const allUserOrders = await orderFoodModel
      .find({
        user_id: id,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await orderFoodModel.countDocuments({
      user_id: id,
    });
    // console.log(limit);
    const totalPages = Math.ceil(total / limit);
    return { allUserOrders, totalPages };
  }
}

const orderFoodServices = new OrderFoodServices();
module.exports = orderFoodServices;
