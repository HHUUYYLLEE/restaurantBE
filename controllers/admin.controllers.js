const reviewServices = require("../services/review.services");
const reviewScoreServices = require("../services/review_score.services");
const userServices = require("../services/user.services");
const restaurantServices = require("../services/restaurant.services");
const { REVIEW, USER } = require("../constants/message");
const drive = require("../utils/googledrivecre");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const deleteReview = async (req, res) => {
  const { review_id } = req.body;
  for (const url of req.review.images) {
    if (url.includes("drive.google.com/thumbnail"))
      await drive.files.delete({
        fileId: url.split("drive.google.com/thumbnail?id=")[1],
      });
  }
  const review = await reviewServices.deleteReview(review_id);
  if (!review)
    throw new ErrorWithStatus({
      message: REVIEW.DELETE_FAILED,
      status: STATUS.BAD_REQUEST,
    });
  const reviewScores = await reviewScoreServices.removeAllReviewScoresOfReview(
    review_id
  );
  res.json({
    message: REVIEW.DELETE_SUCCESS,
  });
};
const verifyBlogger = async (req, res) => {
  let { user_id, status } = req.body;
  status = parseInt(status);
  const updateUser = await userServices.updateUser(user_id, { status: status });
  if (!updateUser)
    throw new ErrorWithStatus({
      message: USER.VERIFY_BLOGGER_FAILED,
      status: STATUS.BAD_REQUEST,
    });
  res.json({ message: USER.VERIFY_BLOGGER_SUCCESS });
};
const modifyUserStatus = async (req, res) => {
  let { user_id, status } = req.body;
  if (user_id === req.user._id.toString())
    throw new ErrorWithStatus({
      message: USER.MODIFY_STATUS_FAILED,
      status: STATUS.BAD_REQUEST,
    });
  status = parseInt(status);
  const updateUser = await userServices.updateUser(user_id, { status: status });
  if (!updateUser)
    throw new ErrorWithStatus({
      message: USER.MODIFY_STATUS_FAILED,
      status: STATUS.BAD_REQUEST,
    });
  res.json({ message: USER.MODIFY_STATUS_SUCCESS });
};

const getAllReviews = async (req, res) => {
  let { report_status } = req.query;
  if (!report_status) report_status = 0;
  report_status = parseInt(report_status);
  // console.log(report_status);
  const reviews = await reviewServices.getAllReviews();
  if (reviews.length === 0)
    throw new ErrorWithStatus({
      message: REVIEW.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  let restaurantIDs = [];
  for (const review of reviews)
    restaurantIDs.push(review.restaurant_id.toString());
  const uniqueRestaurantIDs = [...new Set(restaurantIDs)];
  var responseData = [];
  for (const id of uniqueRestaurantIDs) {
    const restaurant = await restaurantServices.getRestaurant(id);
    let modifiedRestaurant = restaurant.toObject();
    modifiedRestaurant.reviews = [];
    for (var review of reviews) {
      if (
        review.restaurant_id.toString() === id &&
        (review.report_status === 1 || report_status === 0)
      ) {
        review = review.toObject();
        const user = await userServices.getUserFromId(review.user_id);
        review.username = user.username;
        review.avatar_url = user.avatar_url;
        modifiedRestaurant.reviews.push(review);
      }
    }
    if (modifiedRestaurant.reviews.length > 0)
      responseData.push(modifiedRestaurant);
  }

  if (responseData.length === 0)
    throw new ErrorWithStatus({
      message: REVIEW.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  res.json({ message: REVIEW.FOUND, responseData });
};
const getAllUsers = async (req, res) => {
  const users = await userServices.getAllUsers();
  res.json({ message: USER.FOUND, users });
};
const getAllBloggerRequestsUsers = async (req, res) => {
  const users = await userServices.getAllUsers({ status: 2 });
  res.json({ message: USER.FOUND, users });
};
module.exports = {
  deleteReview,
  verifyBlogger,
  modifyUserStatus,
  getAllReviews,
  getAllUsers,
  getAllBloggerRequestsUsers,
};
