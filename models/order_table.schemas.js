const mongoose = require("mongoose");

const OrderTableSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    table_chair: [{ table: { type: Number }, chair: { type: Number } }],
    memo: { type: String, maxlength: 1000 },
    status: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: "order_table",
  }
);

const orderTableModel = mongoose.model("order_table", OrderTableSchema);

module.exports = orderTableModel;
