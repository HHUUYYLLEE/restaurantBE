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
    const deletedOrderFoodList = await orderFoodListModel.findByIdAndDelete(id);
    return deletedOrderFoodList;
  }
  async findFoodByOrder(id) {
    const food = await orderFoodListModel.find({ order_food_menu_id: id });
    return food;
  }
  async findOrderByFoodAndOrderPair(order_food_menu_id, food_id) {
    const order = await orderFoodListModel.find({
      order_food_menu_id: order_food_menu_id,
      food_id: food_id,
    });
    return order;
  }
}

const orderFoodServices = new OrderFoodListServices();
module.exports = orderFoodServices;
