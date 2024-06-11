const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const wrapRequestHandler = require("../utils/handlers");
const {
  createReview,
  updateReview,
  getAllReviewsRestaurant,
  deleteReview,
  reportReview,
  likeDislikeReview,
} = require("../controllers/review.controllers");
const {
  getAllReviewsRestaurantValidator,
  createReviewValidator,
  updateReviewValidator,
  updateReviewFormValidator,
  createReviewFormValidator,
  tokenValidatingResult,
  googleDriveUpload,
} = require("../middlewares/review.middlewares");
const {
  validateAccessToken,
  validateRefreshToken,
} = require("../middlewares/user.middlewares");
router.post(
  "/create_review",
  upload.array("images[]"),
  createReviewFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(createReview)
);

router.put(
  "/upate_review",
  upload.array("images[]"),
  updateReviewFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(updateReview)
);
router.put(
  "/delete_review",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(deleteReview)
);
module.exports = router;
