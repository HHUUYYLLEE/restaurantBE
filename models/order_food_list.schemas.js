const mongoose = require("mongoose");

const OrderFoodListSchema = new mongoose.Schema(
  {
    order_food_menu_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    food_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: { type: Number, required: true },
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
