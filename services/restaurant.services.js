const RestaurantModel = require("../models/restaurant.schemas");
class RestaurantServices {
  async createRestaurant(obj) {
    const newRestaurant = await RestaurantModel.create(obj);
    return newRestaurant;
  }
  async getAllConditionRestaurants(conditions) {
    let restaurants;
    if (conditions) {
      restaurants = await RestaurantModel.find(conditions);
      return restaurants;
    } else restaurants = await RestaurantModel.find(conditions);

    return restaurants;
  }
  async getAllRestaurants() {
    const restaurants = await RestaurantModel.find();

    const total = await RestaurantModel.countDocuments();

    return { restaurants, total };
  }
  async updateRestaurant(restaurant_id, obj) {
    const restaurant = await RestaurantModel.findByIdAndUpdate(
      restaurant_id,
      obj
    );
    return restaurant;
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
