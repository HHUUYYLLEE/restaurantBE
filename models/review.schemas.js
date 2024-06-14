const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    images: [{ type: String, maxlength: 160 }],
    quality_score: { type: Number, required: true },
    service_score: { type: Number, required: true },
    location_score: { type: Number, required: true },
    price_score: { type: Number, required: true },
    area_score: { type: Number, required: true },
    report_status: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: "review",
  }
);

const reviewModel = mongoose.model("review", ReviewSchema);

module.exports = reviewModel;
