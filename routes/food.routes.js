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
  googleDriveUpload,
  getAllFoodValidator,
  getFoodValidator,
  getAllFoodInRestaurantValidator,
} = require("../middlewares/food.middlewares");

router.post(
  "/",
  upload.single("image"),
  foodImageValidator,
  googleDriveUpload,
  createFoodValidator,
  wrapRequestHandler(createFood)
);
router.get("/:id", getFoodValidator, wrapRequestHandler(getFood));
router.get(
  "/restaurant/:id",
  getAllFoodInRestaurantValidator,
  wrapRequestHandler(getAllFoodInRestaurant)
);
router.get("/", getAllFoodValidator, wrapRequestHandler(getAllFood));
module.exports = router;
