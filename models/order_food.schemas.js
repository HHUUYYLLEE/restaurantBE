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
    memo: { type: String, maxlength: 1000 },
    status: { type: Number, required: true },
    total_price: { type: Number, required: true },
    address: { type: String, maxlength: 250 },
    lat: { type: String, maxlength: 160 },
    lng: { type: String, maxlength: 160 },
  },
  {
    timestamps: true,
    collection: "order_food",
  }
);

const orderFoodModel = mongoose.model("order_food", OrderFoodSchema);

module.exports = orderFoodModel;
