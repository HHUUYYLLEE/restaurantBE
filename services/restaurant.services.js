const RestaurantModel = require("../models/restaurant.schemas");
class RestaurantServices {
  async createRestaurant(obj) {
    const newRestaurant = await RestaurantModel.create(obj);
    return newRestaurant;
  }
  async getAllRestaurants({ conditions, page, limit }) {
    let restaurants;
    if (page !== "" && limit !== "") {
      restaurants = await RestaurantModel.find(conditions)
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await RestaurantModel.countDocuments(conditions);
      const totalPages = Math.ceil(total / limit);
      return { restaurants, totalPages };
    } else restaurants = await RestaurantModel.find(conditions);

    const total = await RestaurantModel.countDocuments(conditions);

    return { restaurants, total };
  }
  async findRestaurantUserMatch(user_id, restaurant_id) {
    return RestaurantModel.findOne({
      _id: restaurant_id,
      user_id: user_id,
    });
  }
  async getRestaurant(id) {
    const restaurant = await RestaurantModel.findById(id);
    return restaurant;
  }
  async findAllUserRestaurants(user_id) {
    return RestaurantModel.find({ user_id: user_id });
  }
}

const restaurantServices = new RestaurantServices();
module.exports = restaurantServices;
