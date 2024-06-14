const express = require("express");
const router = express.Router();
const wrapRequestHandler = require("../utils/handlers");
const {
  getOrderTable,
  getAllUserOrderTable,
  getAllRestaurantsPlacedOrderTable,
  getOrderTableHost,
  updateHostOrderTable,
  cancelOrderTable,
  createOrderTable,
} = require("../controllers/order_table.controllers");
const {
  tokenValidatingResult,
  orderTableFormValidator,
  cancelOrderTableFormValidator,
  cancelOrderTableValidator,
  getAllOrdersTableValidator,
  orderTableValidator,
  getOrderTableValidator,
  getOrderTableHostValidator,
  updateOrderTableHostFormValidator,
  updateOrderTableHostValidator,
  getOrderTableFormValidator,
} = require("../middlewares/order_table.middlewares");
const {
  validateAccessToken,
  validateRefreshToken,
} = require("../middlewares/user.middlewares");
router.get(
  "/all_placed_orders",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(getAllRestaurantsPlacedOrderTable)
);
router.get(
  "/host_order/:id",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  getOrderTableHostValidator,
  wrapRequestHandler(getOrderTableHost)
);
router.get(
  "/:id",
  getOrderTableFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  getOrderTableValidator,
  wrapRequestHandler(getOrderTable)
);
router.put(
  "/cancel_order",
  cancelOrderTableFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  cancelOrderTableValidator,
  wrapRequestHandler(cancelOrderTable)
);
router.put(
  "/update_order_host",
  updateOrderTableHostFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  updateOrderTableHostValidator,
  wrapRequestHandler(updateHostOrderTable)
);
router.post(
  "/placeorder",
  orderTableFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  orderTableValidator,
  wrapRequestHandler(createOrderTable)
);
router.get(
  "/",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  getAllOrdersTableValidator,
  wrapRequestHandler(getAllUserOrderTable)
);

module.exports = router;
