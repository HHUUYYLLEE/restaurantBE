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
  likeDislikeReviewValidator,
  googleDriveUpload,
  reportReviewFormValidator,
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
  "/like_dislike_review",
  likeDislikeReviewValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(likeDislikeReview)
);

router.put(
  "/update_review",
  upload.array("images[]"),
  updateReviewFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  updateReviewValidator,
  wrapRequestHandler(updateReview)
);
router.put(
  "/delete_review",
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  updateReviewValidator,
  wrapRequestHandler(deleteReview)
);
router.put(
  "/report_review",
  reportReviewFormValidator,
  validateAccessToken,
  validateRefreshToken,
  tokenValidatingResult,
  wrapRequestHandler(reportReview)
);
module.exports = router;
