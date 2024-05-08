const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer/restaurant.multer");
const wrapRequestHandler = require("../utils/handlers");
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurant,
} = require("../controllers/restaurant.controllers");
const {
  createRestaurantValidator,
  restaurantImageValidator,
  getAllRestaurantsValidator,
  getRestaurantValidator,
} = require("../middlewares/restaurant.middlewares");

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  restaurantImageValidator,
  createRestaurantValidator,
  wrapRequestHandler(createRestaurant)
);

router.get("/:id", getRestaurantValidator, wrapRequestHandler(getRestaurant));
router.get(
  "/",
  getAllRestaurantsValidator,
  wrapRequestHandler(getAllRestaurants)
);
module.exports = router;
