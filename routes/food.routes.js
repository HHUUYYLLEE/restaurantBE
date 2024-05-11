const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
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
  tokenValidatingResult,
  googleDriveUpload,
  getAllFoodValidator,
  getFoodValidator,
  getAllFoodInRestaurantValidator,
} = require("../middlewares/food.middlewares");
const { validateAccessToken } = require("../middlewares/user.middlewares");

router.post(
  "/",
  upload.single("image"),
  validateAccessToken,
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
