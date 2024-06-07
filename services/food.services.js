const FoodModel = require("../models/food.schemas");
const mongoose = require("mongoose");

class FoodServices {
  async createFood(obj) {
    const newFood = await FoodModel.create(obj);
    return newFood;
  }
  async getAllFood({ conditions, page, limit }) {
    let allFood;
    if (page !== "" && limit !== "") {
      allFood = await FoodModel.find(conditions)
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await FoodModel.countDocuments(conditions);
      const totalPages = Math.ceil(total / limit);
      return { allFood, totalPages };
    } else return await FoodModel.find(conditions);
  }
  async getFood(id) {
    const food = await FoodModel.findById(id);
    return food;
  }
  async getAllFoodInRestaurant(id, page, limit) {
    const allFoodInRestaurant = await FoodModel.find({
      restaurant_id: id,
    })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await FoodModel.countDocuments({
      restaurant_id: id,
    });
    console.log(limit);
    const totalPages = Math.ceil(total / limit);
    return { allFoodInRestaurant, totalPages };
  }
}

const foodServices = new FoodServices();
module.exports = foodServices;
