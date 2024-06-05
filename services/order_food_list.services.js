const mongoose = require("mongoose");
const orderFoodListModel = require("../models/order_food_list.schemas");
class OrderFoodListServices {
  async createOrderFoodList(obj) {
    const newOrderList = await orderFoodListModel.create(obj);
    return newOrderList;
  }
  async updateOrderFoodList(id, obj) {
    const updateOrderFoodList = await orderFoodListModel.findByIdAndUpdate(
      id,
      obj,
      { new: true }
    );
    return updateOrderFoodList;
  }
  async deleteOrderFoodList(id) {
    const deletedOrderFoodList = orderFoodListModel.findByIdAndDelete(id);
    return deletedOrderFoodList;
  }
  async findFoodByOrder(id) {
    const food = orderFoodListModel.find({ order_food_menu_id: id });
    return food;
  }
  async findOrderByFood(id) {
    const order = orderFoodListModel.find({ food_id: id });
    return order;
  }
}

const orderFoodServices = new OrderFoodListServices();
module.exports = orderFoodServices;
