const express = require("express");
const router = express.Router();
const wrapRequestHandler = require("../utils/handlers");
const {
  updateOrderFood,
  getAllOrderFood,
  getOrderFood,
  placeAnOrder,
} = require("../controllers/order_food.controllers");
const {
  createOrderFoodValidator,
  tokenValidatingResult,
  getAllOrderFoodValidator,
  getOrderFoodValidator,
  findFoodValidator,
  placeOrderFoodValidator,
  placeOrderFoodValidatorForm,
} = require("../middlewares/order_food.middlewares");
const {
  validateAccessToken,
  validateRefreshToken,
} = require("../middlewares/user.middlewares");

router.get(
  "/:id",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  getOrderFoodValidator,
  wrapRequestHandler(getOrderFood)
);
router.post(
  "/placeorder",
  placeOrderFoodValidatorForm,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  placeOrderFoodValidator,
  wrapRequestHandler(placeAnOrder)
);
router.get(
  "/",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  getAllOrderFoodValidator,
  wrapRequestHandler(getAllOrderFood)
);

router.post(
  "/",
  createOrderFoodValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  findFoodValidator,
  wrapRequestHandler(updateOrderFood)
);
module.exports = router;
