const reviewScoreModel = require("../models/review_score.schemas");
const mongoose = require("mongoose");

class ReviewScoreServices {
  async createReviewScore(obj) {
    return await reviewScoreModel.create(obj);
  }
  async getReviewUserPair(review_id, user_id) {
    return await reviewScoreModel.findOne({ review_id, user_id });
  }
  async getAllReviewScoresOfReview(review_id) {
    return await reviewScoreModel.find({ review_id });
  }

  async updateReviewScore(id, obj) {
    return await reviewScoreModel.findByIdAndUpdate(id, obj);
  }
  async removeAllReviewScoresOfReview(review_id) {
    return await reviewScoreModel.deleteMany({ review_id });
  }
}

const reviewScoreServices = new ReviewScoreServices();
module.exports = reviewScoreServices;
