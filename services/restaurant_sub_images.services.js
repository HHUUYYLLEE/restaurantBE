const RestaurantSubImagesModel = require("../models/restaurant_sub_images.schemas");

class RestaurantSubImagesServices {
  async createRestaurantSubImages(obj) {
    const newRestaurantSubImages = await RestaurantSubImagesModel.create(obj);
    return newRestaurantSubImages;
  }
  async findRestaurantSubImages(id) {
    return await RestaurantSubImagesModel.findOne({ restaurant_id: id });
  }
}

const restaurantSubImagesServices = new RestaurantSubImagesServices();
module.exports = restaurantSubImagesServices;
