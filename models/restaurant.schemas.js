const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, maxlength: 160, required: true },
    desc: { type: String, maxlength: 1000, required: true },
    address: { type: String, maxlength: 250, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    morning_open_time: { type: String, required: false },
    morning_closed_time: { type: String, required: false },
    afternoon_open_time: { type: String, required: false },
    afternoon_closed_time: { type: String, required: false },
    status: { type: Number, required: true },
    main_avatar_url: { type: String, maxlength: 160, required: false },
    lat: { type: mongoose.Decimal128, maxlength: 160, required: true },
    lng: { type: mongoose.Decimal128, maxlength: 160, required: true },
  },
  {
    timestamps: true,
    collection: "restaurant",
  }
);

const RestaurantModel = mongoose.model("restaurant", RestaurantSchema);

module.exports = RestaurantModel;
