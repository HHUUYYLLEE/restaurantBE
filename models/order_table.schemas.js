const mongoose = require("mongoose");

const OrderTableSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },
    table_num: { type: Number, required: true },
    chair_num: { type: Number, required: true },
    memo: { type: String, maxlength: 1000, required: true },
    status: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: "order_table",
  }
);

const orderTableModel = mongoose.model("order_table", OrderTableSchema);

module.exports = orderTableModel;
