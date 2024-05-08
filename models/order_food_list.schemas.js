const mongoose = require("mongoose");

const OrderFoodListSchema = new mongoose.Schema(
  {
    ward: { type: String },
    code: { type: String },
    parent_code: { type: String },
  },
  {
    timestamps: true,
    collection: "order_food_list",
  }
);

const orderFoodListModel = mongoose.model(
  "order_food_list",
  OrderFoodListSchema
);

module.exports = orderFoodListModel;
