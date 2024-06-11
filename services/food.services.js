const foodModel = require("../models/food.schemas");
const mongoose = require("mongoose");

class FoodServices {
  async createFood(obj) {
    const newFood = await foodModel.create(obj);
    return newFood;
  }
  async getAllFood({ conditions, sortByPrice, page, limit }) {
    let allFood;
    if (!parseInt(sortByPrice))
      allFood = await foodModel
        .find(conditions)
        .skip((page - 1) * limit)
        .limit(limit);
    else
      allFood = await foodModel
        .find(conditions)
        .sort({ price: parseInt(sortByPrice) })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await foodModel.countDocuments(conditions);
    const totalPages = Math.ceil(total / limit);
    return { allFood, totalPages };
  }
  async getFood(id) {
    const food = await foodModel.findById(id);
    return food;
  }
  async updateFood(id, obj) {
    const food = await foodModel.findByIdAndUpdate(id, obj);
    return food;
  }
  async getAllFoodInRestaurant(id, page, limit) {
    const allFoodInRestaurant = await foodModel
      .find({
        restaurant_id: id,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await foodModel.countDocuments({
      restaurant_id: id,
    });
    console.log(limit);
    const totalPages = Math.ceil(total / limit);
    return { allFoodInRestaurant, totalPages };
  }
}

const foodServices = new FoodServices();
module.exports = foodServices;
