const express = require("express");
const router = express.Router();
const wrapRequestHandler = require("../utils/handlers");
const {
  createOrderFood,
  getAllOrderFood,
  getOrderFood,
} = require("../controllers/order_food.controllers");
const {
  createOrderFoodValidator,
  tokenValidatingResult,
  getAllOrderFoodValidator,
  getOrderFoodValidator,
  findFoodValidator,
} = require("../middlewares/order_food.middlewares");
const {
  validateAccessToken,
  validateRefreshToken,
} = require("../middlewares/user.middlewares");

router.post(
  "/",
  createOrderFoodValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  findFoodValidator,
  wrapRequestHandler(createOrderFood)
);
router.get("/:id", getOrderFoodValidator, wrapRequestHandler(getOrderFood));

router.get("/", getAllOrderFoodValidator, wrapRequestHandler(getAllOrderFood));
module.exports = router;
