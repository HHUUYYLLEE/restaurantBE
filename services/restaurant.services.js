const RestaurantModel = require("../models/restaurant.schemas");

class RestaurantServices {
  async createRestaurant(obj) {
    const newRestaurant = await RestaurantModel.create(obj);
    return newRestaurant;
  }
  async getAllRestaurants({ conditions, page, limit }) {
    const restaurants = await RestaurantModel.find(conditions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await RestaurantModel.countDocuments(conditions);
    const totalPages = Math.ceil(total / limit);
    return { restaurants, totalPages };
  }
  async findRestaurantUserMatch(user_id, restaurant_id) {
    return await RestaurantModel.findOne({
      _id: restaurant_id,
      user_id: user_id,
    });
  }
  async getRestaurant(id) {
    const restaurant = await RestaurantModel.findById(id);
    return restaurant;
  }
}

const restaurantServices = new RestaurantServices();
module.exports = restaurantServices;
