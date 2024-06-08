const { RESTAURANT, USER, FOOD } = require("../constants/message");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const restaurantServices = require("../services/restaurant.services");
const restaurantSubImagesServices = require("../services/restaurant_sub_images.services");
const userServices = require("../services/user.services");
const foodServices = require("../services/food.services");
const createRestaurant = async (req, res) => {
  const {
    name,
    desc,
    address,
    morning_open_time,
    morning_closed_time,
    afternoon_open_time,
    afternoon_closed_time,
    status,
    lat,
    lng,
    table_chair,
  } = req.body;
  const user_id = req.user._id;
  if (!(await userServices.getUserFromId(user_id)))
    throw new ErrorWithStatus({
      message: USER.NOT_FOUND,
      status: STATUS.BAD_REQUEST,
    });
  const newRestaurant = await restaurantServices.createRestaurant({
    name,
    desc,
    address,
    user_id,
    morning_open_time,
    morning_closed_time,
    afternoon_open_time,
    afternoon_closed_time,
    status,
    main_avatar_url: req.fileURLs[0],
    lat,
    lng,
    table_chair,
  });
  if (!newRestaurant) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_CREATED,
      status: STATUS.BAD_REQUEST,
    });
  } else
    await restaurantSubImagesServices.createRestaurantSubImages({
      restaurant_id: newRestaurant._id,
      images: req.fileURLs.slice(1, 5),
    });

  res.json({ message: RESTAURANT.CREATED, newRestaurant });
};

const getAllConditionRestaurants = async (req, res) => {
  let { search, page, limit } = req.query;
  // page = parseInt(page) || 1;
  // limit = parseInt(limit) || 10;
  let conditions = {};
  if (search) {
    conditions.$or = [{ name: { $regex: search, $options: "i" } }];
  }
  // console.log(conditions);
  const { restaurants, totalPages } =
    await restaurantServices.getAllConditionRestaurants({
      conditions,
      page,
      limit,
    });
  if (!restaurants) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({
    message: RESTAURANT.FOUND,
    restaurants,
    totalPages,
    page,
    limit,
  });
};
const getRandomRestaurants = async (req, res) => {
  const restaurants = await restaurantServices.getAllRestaurants();
  if (!restaurants) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }

  for (let i = restaurants.restaurants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [restaurants.restaurants[i], restaurants.restaurants[j]] = [
      restaurants.restaurants[j],
      restaurants.restaurants[i],
    ];
  }
  restaurants.restaurants.splice(10);
  res.json({
    message: RESTAURANT.FOUND,
    restaurants,
  });
};
const getRestaurant = async (req, res) => {
  const { id } = req.params;
  const restaurant = await restaurantServices.getRestaurant(id);
  if (!restaurant) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  const restaurantSubImages =
    await restaurantSubImagesServices.findRestaurantSubImages(id);
  // console.log(restaurantSubImages);
  let restaurantData = restaurant.toJSON();
  restaurantData.images = restaurantSubImages.toJSON().images;
  res.json({ message: RESTAURANT.FOUND, restaurant: restaurantData });
};
const getAllUserRestaurants = async (req, res) => {
  const { id } = req.params;
  const restaurants = await restaurantServices.findAllUserRestaurants(id);
  if (!restaurants) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({ message: RESTAURANT.FOUND_ALL, restaurants });
};

const searchRestaurantsAndFood = async (req, res) => {
  let { search, address, mode } = req.query;

  if (!mode) mode = 1;
  // console.log("this");
  let conditions = {};
  if (address && search)
    conditions.$and = [
      {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { desc: { $regex: search, $options: "i" } },
        ],
      },
      { address: { $regex: address, $options: "i" } },
    ];
  else if (search) {
    conditions.$or = [
      { name: { $regex: search, $options: "i" } },
      { desc: { $regex: search, $options: "i" } },
      { address: { $regex: search, $options: "i" } },
    ];
  } else if (address) {
    conditions.$or = [{ address: { $regex: address, $options: "i" } }];
  }

  // console.log(conditions);
  let { restaurants } = await restaurantServices.getAllConditionRestaurants({
    conditions,
    page: "",
    limit: "",
  });
  if (search) conditions.$or = [{ name: { $regex: search, $options: "i" } }];
  const allFood = await foodServices.getAllFood({
    conditions,
    page: "",
    limit: "",
  });
  if (!restaurants && !allFood) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND + " and " + FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  if (mode === 1) {
    let data = [];
    if (restaurants) data = data.concat(restaurants);
    if (allFood) data = data.concat(allFood);
    res.json({
      message: RESTAURANT.FOUND + " and " + FOOD.FOUND,
      data,
    });
  } else {
    res.json({
      message: RESTAURANT.FOUND + " and " + FOOD.FOUND,
      restaurants,
      allFood,
    });
  }
};

module.exports = {
  createRestaurant,
  getAllConditionRestaurants,
  getRestaurant,
  getAllUserRestaurants,
  searchRestaurantsAndFood,
  getRandomRestaurants,
};
