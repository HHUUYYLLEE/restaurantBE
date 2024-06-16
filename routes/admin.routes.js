const express = require("express");
const router = express.Router();
const wrapRequestHandler = require("../utils/handlers");

const {
  validateAccessToken,
  validateRefreshToken,
} = require("../middlewares/user.middlewares");
const {
  tokenValidatingResult,
  deleteReviewFormValidator,
  verifyBloggerFormValidator,
  modifyUserStatusFormValidator,
  deleteReviewValidator,
} = require("../middlewares/admin.middlewares");
const {
  deleteReview,
  verifyBlogger,
  modifyUserStatus,
  getAllReviews,
  getAllUsers,
  getAllBloggerRequestsUsers,
} = require("../controllers/admin.controllers");

router.get(
  "/users",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(getAllUsers)
);
router.get(
  "/reviews",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(getAllReviews)
);
router.get(
  "/blogger_requests",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(getAllBloggerRequestsUsers)
);

router.post(
  "/delete_review",
  deleteReviewFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  deleteReviewValidator,
  wrapRequestHandler(deleteReview)
);
router.post(
  "/verify_blogger",
  verifyBloggerFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(verifyBlogger)
);
router.post(
  "/modify_user_status",
  modifyUserStatusFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(modifyUserStatus)
);
module.exports = router;
