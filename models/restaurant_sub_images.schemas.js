const mongoose = require("mongoose");

const RestaurantSubImagesSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    images: [{ type: String, maxlength: 160 }],
  },
  {
    collection: "restaurant_sub_images",
  }
);

const restaurantSubImagesModel = mongoose.model(
  "restaurant_sub_images",
  RestaurantSubImagesSchema
);

module.exports = restaurantSubImagesModel;
