const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const wrapRequestHandler = require("../utils/handlers");
const {
  createFood,
  getAllFood,
  getFood,
  getAllFoodInRestaurant,
  updateFood,
} = require("../controllers/food.controllers");
const {
  createFoodValidator,
  foodImageValidator,
  tokenValidatingResult,
  googleDriveUpload,
  getAllFoodValidator,
  getFoodValidator,
  getAllFoodInRestaurantValidator,
  createFoodFormValidator,
  updateFoodValidator,
  updateFoodFormValidator,
} = require("../middlewares/food.middlewares");
const {
  validateAccessToken,
  validateRefreshToken,
} = require("../middlewares/user.middlewares");
router.put(
  "/update_food",
  upload.single("image"),
  updateFoodFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  foodImageValidator,
  updateFoodValidator,
  wrapRequestHandler(updateFood)
);
router.post(
  "/",
  upload.single("image"),
  createFoodFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  foodImageValidator,
  createFoodValidator,
  googleDriveUpload,
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
