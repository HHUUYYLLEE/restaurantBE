const orderTableModel = require("../models/order_table.schemas");
const mongoose = require("mongoose");
class OrderTableServices {
  async createOrderTable(obj) {
    const newOrder = await orderTableModel.create(obj);
    return newOrder;
  }
  async updateOrderTable(id, obj) {
    return await orderTableModel.findByIdAndUpdate(id, obj, {
      new: true,
    });
  }

  async findTableOrdersByUser(id) {
    return await orderTableModel.find({ user_id: id });
  }
  async findTableOrderById(id) {
    return await orderTableModel.findById(id);
  }

  async findTableOrderAndUserPair(order_id, user_id) {
    const orderAndUserPair = await orderTableModel.findOne({
      _id: order_id,
      user_id: user_id,
    });
    return orderAndUserPair;
  }
  async findRestaurantAndUserOrderTablePair(conditions) {
    return await orderTableModel.findOne(conditions);
  }
  async getAllUserTableOrders(id, page, limit) {
    const allUserOrders = await orderTableModel
      .find({
        user_id: id,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await orderTableModel.countDocuments({
      user_id: id,
    });
    // console.log(limit);
    const totalPages = Math.ceil(total / limit);
    return { allUserOrders, totalPages };
  }
  async getAllTableOrdersByRestaurant(conditions) {
    return await orderTableModel.find(conditions);
  }
}

const orderTableServices = new OrderTableServices();
module.exports = orderTableServices;
