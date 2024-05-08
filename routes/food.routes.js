const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer/food.multer");
const wrapRequestHandler = require("../utils/handlers");
const {
  createFood,
  getAllFood,
  getFood,
  getAllFoodInRestaurant,
} = require("../controllers/food.controllers");
const {
  createFoodValidator,
  foodImageValidator,
  getAllFoodValidator,
  getFoodValidator,
  getAllFoodInRestaurantValidator,
} = require("../middlewares/food.middlewares");

router.post(
  "/",
  upload.food("image"),
  foodImageValidator,
  createFoodValidator,
  wrapRequestHandler(createFood)
);
router.get("/:id", getFoodValidator, wrapRequestHandler(getFood));
router.get("/restaurant/:id", getFoodValidator, wrapRequestHandler(getFood));
router.get("/", getAllFoodValidator, wrapRequestHandler(getAllFood));
module.exports = router;
