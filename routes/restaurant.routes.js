const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const wrapRequestHandler = require("../utils/handlers");
const {
  createRestaurant,
  getAllConditionRestaurants,
  getRestaurant,
  getAllUserRestaurants,
  searchRestaurantsAndFood,
  getRandomRestaurants,
  findNearbyRestaurants,
  updateRestaurant,
} = require("../controllers/restaurant.controllers");
const {
  createRestaurantSchemaValidator,
  createRestaurantDataValidator,
  restaurantImageValidator,
  getAllConditionRestaurantsValidator,
  googleDriveUpload,
  tokenValidatingResult,
  getRestaurantValidator,
  getAllUserRestaurantsValidator,
  simpleSearchRestaurantsAndFoodValidator,
  searchRestaurantsAndFoodValidator,
  findNearbyRestaurantsValidator,
  updateRestaurantSchemaValidator,
  updateRestaurantValidator,
} = require("../middlewares/restaurant.middlewares");
const {
  validateAccessToken,
  validateRefreshToken,
} = require("../middlewares/user.middlewares");
router.put(
  "/update_restaurant",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  updateRestaurantSchemaValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  restaurantImageValidator,
  updateRestaurantValidator,
  wrapRequestHandler(updateRestaurant)
);
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  createRestaurantSchemaValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  restaurantImageValidator,
  createRestaurantDataValidator,
  googleDriveUpload,
  wrapRequestHandler(createRestaurant)
);

router.get(
  "/restaurants/:id",
  getAllUserRestaurantsValidator,
  wrapRequestHandler(getAllUserRestaurants)
);
router.get(
  "/restaurants_and_food",
  searchRestaurantsAndFoodValidator,
  wrapRequestHandler(searchRestaurantsAndFood)
);
router.get(
  "/simple_restaurants_and_food",
  simpleSearchRestaurantsAndFoodValidator,
  wrapRequestHandler(searchRestaurantsAndFood)
);
router.get(
  "/find_nearby_restaurants",
  findNearbyRestaurantsValidator,
  wrapRequestHandler(findNearbyRestaurants)
);
router.get("/random_restaurants", wrapRequestHandler(getRandomRestaurants));
router.get(
  "/:id",
  getRestaurantValidator,
  validateAccessToken,
  validateRefreshToken,
  wrapRequestHandler(getRestaurant)
);
router.get(
  "/",
  getAllConditionRestaurantsValidator,
  validateAccessToken,
  validateRefreshToken,
  wrapRequestHandler(getAllConditionRestaurants)
);

module.exports = router;
