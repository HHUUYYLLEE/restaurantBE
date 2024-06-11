const reviewModel = require("../models/review.schemas");
const mongoose = require("mongoose");

class ReviewServices {
  async createReview(obj) {
    return await reviewModel.create(obj);
  }
  async getReview(id) {
    return await reviewModel.findById(id);
  }
  async getAllReviewsInRestaurant(restaurant_id) {
    return await reviewModel.find({ restaurant_id: restaurant_id });
  }
  async getAllReviews() {
    return await reviewModel.find();
  }
  async updateReview(id, obj) {
    return await reviewModel.findByIdAndUpdate(id, obj);
  }
  async deleteReview(id) {
    return await reviewModel.findByIdAndDelete(id);
  }
}

const reviewServices = new ReviewServices();
module.exports = reviewServices;
