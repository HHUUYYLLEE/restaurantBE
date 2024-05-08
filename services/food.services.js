const FoodModel = require("../models/food.schemas");
const mongoose = require("mongoose");

class FoodServices {
  async createFood(obj) {
    const newFood = await FoodModel.create(obj);
    return newFood;
  }
  async getAllFood({ conditions, page, limit }) {
    const allFood = await FoodModel.find(conditions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await FoodModel.countDocuments(conditions);
    const totalPages = Math.ceil(total / limit);
    return { allFood, totalPages };
  }
  async getFood(id) {
    const food = await FoodModel.findById(id);
    return food;
  }
  async getAllFoodInRestaurant(id, page, limit) {
    const allFoodInRestaurant = await FoodModel.find({
      restaurant_id: new mongoose.Types.ObjectId(id),
    })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await FoodModel.countDocuments({
      restaurant_id: new mongoose.Types.ObjectId(id),
    });
    const totalPages = Math.ceil(total / limit);
    return { allFoodInRestaurant, totalPages };
  }
}

const foodServices = new FoodServices();
module.exports = foodServices;
