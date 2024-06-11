const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: { type: String, maxlength: 160, required: true },
    desc: { type: String, maxlength: 160, required: false },
    image_url: { type: String, maxlength: 160, required: false },
    status: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    collection: "food",
  }
);

const foodModel = mongoose.model("food", FoodSchema);

module.exports = foodModel;
