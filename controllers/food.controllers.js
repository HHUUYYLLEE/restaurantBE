const { FOOD } = require("../constants/message");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const foodServices = require("../services/food.services");
const restaurantServices = require("../services/restaurant.services");
const createFood = async (req, res) => {
  const { restaurant_id, name, desc, status, price, quantity } = req.body;
  if (!(await restaurantServices.getRestaurant(restaurant_id)))
    throw new ErrorWithStatus({
      message: FOOD.NOT_CREATED,
      status: STATUS.BAD_REQUEST,
    });
  const newFood = await foodServices.createFood({
    restaurant_id,
    name,
    desc,
    status,
    price,
    quantity,
    image_url: req.file.filename,
  });
  if (!newFood) {
    throw new ErrorWithStatus({
      message: FOOD.NOT_CREATED,
      status: STATUS.BAD_REQUEST,
    });
  }
  res.json({ message: FOOD.CREATED, newFood });
};

const getAllFood = async (req, res) => {
  let { search, page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  let conditions = {};
  if (search) {
    conditions.$or = [
      { name: { $regex: search, $options: "i" } },
      // { describe: { $regex: search, $options: "i" } },
      // { full_field: { $regex: search, $options: "i" } },
    ];
  }
  // console.log(conditions);
  const { allFood, totalPage } = await foodServices.getAllFood({
    conditions,
    page,
    limit,
  });
  if (!allFood) {
    throw new ErrorWithStatus({
      message: FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({
    message: FOOD.FOUND,
    allFood,
    totalPage,
    page,
    limit,
  });
};

const getFood = async (req, res) => {
  const { id } = req.params;
  const food = await foodServices.getAllFood(id);
  if (!food) {
    throw new ErrorWithStatus({
      message: FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({ message: FOOD.FOUND, restaurant });
};

const getAllFoodInRestaurant = async (req, res) => {
  let { id, page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const { allFoodInRestaurant, totalPages } =
    await foodServices.getAllFoodInRestaurant({
      id,
      page,
      limit,
    });
  if (!allFoodInRestaurant) {
    throw new ErrorWithStatus({
      message: FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({
    message: FOOD.FOUND,
    allFoodInRestaurant,
    totalPages,
    page,
    limit,
  });
};
module.exports = { createFood, getAllFood, getFood, getAllFoodInRestaurant };
