const mongoose = require("mongoose");

const OrderFoodSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    memo: { type: String, maxlength: 1000, required: true },
    status: { type: Number, required: true },
    total_price: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: "order_food",
  }
);

const orderFoodModel = mongoose.model("order_food", OrderFoodSchema);

module.exports = orderFoodModel;
