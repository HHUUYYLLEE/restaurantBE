const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const wrapRequestHandler = require("../utils/handlers");
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurant,
} = require("../controllers/restaurant.controllers");
const {
  createRestaurantSchemaValidator,
  createRestaurantDataValidator,
  restaurantImageValidator,
  getAllRestaurantsValidator,
  googleDriveUpload,
  tokenValidatingResult,
  getRestaurantValidator,
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

router.get("/:id", getRestaurantValidator, wrapRequestHandler(getRestaurant));
router.get(
  "/",
  getAllRestaurantsValidator,
  wrapRequestHandler(getAllRestaurants)
);
module.exports = router;
