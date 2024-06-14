const express = require("express");
const router = express.Router();
const wrapRequestHandler = require("../utils/handlers");
const {
  updateOrderFood,
  getAllUserOrderFood,
  getOrderFood,
  placeAnOrder,
  getAllRestaurantsPlacedOrderFood,
  getOrderFoodHost,
  updateHostOrderFood,
  cancelOrderFood,
} = require("../controllers/order_food.controllers");
const {
  createOrderFoodValidator,
  tokenValidatingResult,
  getAllOrderFoodValidator,
  getOrderFoodValidator,
  findFoodValidator,
  placeOrderFoodValidator,
  placeOrderFoodValidatorForm,
  getOrderFoodHostValidator,
  updateOrderFoodHostValidator,
  updateOrderFoodHostFormValidator,
  cancelOrderFoodFormValidator,
  cancelOrderFoodValidator,
} = require("../middlewares/order_food.middlewares");
const {
  validateAccessToken,
  validateRefreshToken,
} = require("../middlewares/user.middlewares");
router.get(
  "/all_placed_orders",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(getAllRestaurantsPlacedOrderFood)
);
router.get(
  "/host_order/:id",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  getOrderFoodHostValidator,
  wrapRequestHandler(getOrderFoodHost)
);
router.get(
  "/:id",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  getOrderFoodValidator,
  wrapRequestHandler(getOrderFood)
);
router.put(
  "/cancel_order",
  cancelOrderFoodFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  cancelOrderFoodValidator,
  wrapRequestHandler(cancelOrderFood)
);
router.put(
  "/update_order_host",
  updateOrderFoodHostFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  updateOrderFoodHostValidator,
  wrapRequestHandler(updateHostOrderFood)
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
  wrapRequestHandler(getAllUserOrderFood)
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
