const { RESTAURANT } = require("../constants/message");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const restaurantServices = require("../services/restaurant.services");
const restaurantSubImagesServices = require("../services/restaurant_sub_images.services");
const userServices = require("../services/user.services");
const createRestaurant = async (req, res) => {
  const {
    name,
    desc,
    address,
    user_id,
    morning_open_time,
    morning_closed_time,
    afternoon_open_time,
    afternoon_closed_time,
    status,
    lat,
    lng,
  } = req.body;
  if (!(await userServices.getUser(user_id)))
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_CREATED,
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
    main_avatar_url: req.files.image[0].filename,
    lat,
    lng,
  });
  if (!newRestaurant) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_CREATED,
      status: STATUS.BAD_REQUEST,
    });
  } else
    await restaurantSubImagesServices.createRestaurantSubImages({
      restaurant_id: newRestaurant._id,
      images: [
        req.files.image2[0].filename,
        req.files.image3[0].filename,
        req.files.image4[0].filename,
        req.files.image5[0].filename,
      ],
    });

  res.json({ message: RESTAURANT.CREATED, newRestaurant });
};

const getAllRestaurants = async (req, res) => {
  let { search, page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  let conditions = {};
  if (search) {
    conditions.$or = [
      { name: { $regex: search, $options: "i" } },
      { address: { $regex: search, $options: "i" } },
      // { describe: { $regex: search, $options: "i" } },
      // { full_field: { $regex: search, $options: "i" } },
    ];
  }
  // console.log(conditions);
  const { restaurants, totalPages } =
    await restaurantServices.getAllRestaurants({
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

const getRestaurant = async (req, res) => {
  const { id } = req.params;
  const restaurant = await restaurantServices.getRestaurant(id);
  if (!restaurant) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({ message: RESTAURANT.FOUND, restaurant });
};
module.exports = { createRestaurant, getAllRestaurants, getRestaurant };
