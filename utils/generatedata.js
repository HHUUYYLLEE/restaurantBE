const RestaurantSubImagesModel = require("../models/restaurant_sub_images.schemas");
const UserModel = require("../models/user.schemas");
const RestaurantModel = require("../models/restaurant.schemas");
const FoodModel = require("../models/food.schemas");
const OrderChairModel = require("../models/order_chair.schemas");
const OrderFoodModel = require("../models/order_food.schemas");
const OrderFoodListModel = require("../models/order_food_list.schemas");
const mongoose = require("mongoose");

const generateData = async () => {
  RestaurantSubImagesModel.createCollection();
  UserModel.createCollection();
  FoodModel.createCollection();
  OrderChairModel.createCollection();
  OrderFoodModel.createCollection();
  OrderFoodListModel.createCollection();
  RestaurantModel.createCollection();
};
module.exports = generateData;
