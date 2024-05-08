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
  async getRestaurant(id) {
    const restaurant = await RestaurantModel.findById(id);
    return restaurant;
  }
}

const restaurantServices = new RestaurantServices();
module.exports = restaurantServices;
