const mongoose = require("mongoose");

const ReviewScoreSchema = new mongoose.Schema(
  {
    review_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    vote: { type: String, required: true },
  },
  {
    collection: "review_score",
  }
);

const reviewScoreModel = mongoose.model("review_score", ReviewScoreSchema);

module.exports = reviewScoreModel;
