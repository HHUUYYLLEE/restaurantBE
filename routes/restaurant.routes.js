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
  searchRestaurantsAndFoodValidator,
} = require("../middlewares/restaurant.middlewares");
const {
  validateAccessToken,
  validateRefreshToken,
} = require("../middlewares/user.middlewares");
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
router.get("/random_restaurants", wrapRequestHandler(getRandomRestaurants));
router.get("/:id", getRestaurantValidator, wrapRequestHandler(getRestaurant));
router.get(
  "/",
  getAllConditionRestaurantsValidator,
  wrapRequestHandler(getAllConditionRestaurants)
);

module.exports = router;
