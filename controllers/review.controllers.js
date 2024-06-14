const { FOOD, REVIEW } = require("../constants/message");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const reviewServices = require("../services/review.services");
const reviewScoreServices = require("../services/review_score.services");
const googleDriveURL = require("../utils/googleDriveURL");
const drive = require("../utils/googledrivecre");
const { envConfig } = require("../constants/config");
const stream = require("stream");

const createReview = async (req, res) => {
  const {
    restaurant_id,
    comment,
    quality_score,
    service_score,
    location_score,
    price_score,
    area_score,
  } = req.body;
  req.fileURLs = [];
  const images = req.files;
  // console.log(images);
  for (const { buffer } of images) {
    // console.log(value[0]);
    // console.log(buffer);
    let bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    let tempRNG = Math.random();
    try {
      while (tempRNG === Math.random()) tempRNG = Math.random();
      let filename = Date.now() + tempRNG + "review";
      filename = filename.replace(/\./g, "");
      const metaData = {
        name: filename + ".png",
        parents: [envConfig.review_folder_id], // the ID of the folder you get from createFolder.js is used here
      };
      const media = {
        mimeType: "image/png",
        body: bufferStream, // the image sent through multer will be uploaded to Drive
      };

      // uploading the file
      const uploadFile = await drive.files.create({
        resource: metaData,
        media: media,
        fields: "id",
      });

      // console.log("ID:", uploadFile.data.id);
      req.fileURLs.push(googleDriveURL(uploadFile.data.id));
      // console.log("fileIDs:");
      // console.log(req.fileIDs);
    } catch (err) {
      console.log(err);
      throw new ErrorWithStatus({
        message: REVIEW.IMAGES_UPLOAD_FAILED,
        status: STATUS.INTERNAL_SERVER_ERROR,
      });
    }
  }
  const newReview = await reviewServices.createReview({
    restaurant_id,
    user_id: req.user._id,
    comment,
    quality_score: parseInt(quality_score),
    service_score: parseInt(service_score),
    location_score: parseInt(location_score),
    price_score: parseInt(price_score),
    area_score: parseInt(area_score),
    images: req.fileURLs,
    report_status: 0,
  });
  if (!newReview) {
    throw new ErrorWithStatus({
      message: REVIEW.NOT_CREATED,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
  res.json({ message: REVIEW.CREATED, newReview });
};
const updateReview = async (req, res) => {
  const {
    review_id,
    comment,
    quality_score,
    service_score,
    location_score,
    price_score,
    area_score,
  } = req.body;
  req.fileURLs = [];
  for (const url of req.review.images) {
    if (url.includes("drive.google.com/thumbnail"))
      await drive.files.delete({
        fileId: url.split("drive.google.com/thumbnail?id=")[1],
      });
  }
  const images = req.files;
  // console.log(images);

  for (const image of images) {
    // console.log(value[0]);
    let bufferStream = new stream.PassThrough();
    bufferStream.end(image.buffer);
    let tempRNG = Math.random();
    try {
      while (tempRNG === Math.random()) tempRNG = Math.random();
      let filename = Date.now() + tempRNG + "review";
      filename = filename.replace(/\./g, "");
      const metaData = {
        name: filename + ".png",
        parents: [envConfig.review_folder_id], // the ID of the folder you get from createFolder.js is used here
      };
      const media = {
        mimeType: "image/png",
        body: bufferStream, // the image sent through multer will be uploaded to Drive
      };

      // uploading the file
      const uploadFile = await drive.files.create({
        resource: metaData,
        media: media,
        fields: "id",
      });

      // console.log("ID:", uploadFile.data.id);
      req.fileURLs.push(googleDriveURL(uploadFile.data.id));
      // console.log("fileIDs:");
      // console.log(req.fileIDs);
    } catch (err) {
      throw new ErrorWithStatus({
        message: REVIEW.IMAGES_UPLOAD_FAILED,
        status: STATUS.INTERNAL_SERVER_ERROR,
      });
    }
  }
  const updateReview = await reviewServices.updateReview(review_id, {
    comment,
    quality_score: parseInt(quality_score),
    service_score: parseInt(service_score),
    location_score: parseInt(location_score),
    price_score: parseInt(price_score),
    area_score: parseInt(area_score),
    images: req.fileURLs.length > 0 ? req.fileURLs : [],
  });
  if (!updateReview) {
    throw new ErrorWithStatus({
      message: REVIEW.UPDATE_FAILED,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
  res.json({ message: REVIEW.UPDATE_SUCCESS, updateReview });
};
const getAllReviewsRestaurant = async (req, res) => {
  let { restaurant_id } = req.query;
  const reviews = await reviewServices.getAllReviewsInRestaurant(restaurant_id);
  if (reviews.length === 0)
    throw new ErrorWithStatus({
      message: REVIEW.NOT_FOUND,
      status: STATUS.BAD_REQUEST,
    });
  res.json({
    message: REVIEW.FOUND,
    reviews,
    page,
    limit,
  });
};

const deleteReview = async (req, res) => {
  const { review_id } = req.body;
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
const reportReview = async (req, res) => {
  const { review_id } = req.body;
  const reportReview = await reviewServices.updateReview(review_id, {
    report_status: 1,
  });
  if (!reportReview)
    throw new ErrorWithStatus({
      message: REVIEW.REPORT_FAILED,
      status: STATUS.BAD_REQUEST,
    });
  res.json({
    message: REVIEW.REPORT_SUCCESS,
  });
};
const likeDislikeReview = async (req, res) => {
  const { review_id, vote } = req.body;
  const review = await reviewServices.getReview(review_id);
  if (!review)
    throw new ErrorWithStatus({
      message: REVIEW.NOT_FOUND,
      status: STATUS.BAD_REQUEST,
    });
  const findReviewScore = await reviewScoreServices.getReviewUserPair(
    review_id,
    req.user._id
  );
  if (findReviewScore) {
    const updateReviewScore = await reviewScoreServices.updateReviewScore(
      findReviewScore._id.toString(),
      {
        vote,
      }
    );
    if (!updateReviewScore)
      throw new ErrorWithStatus({
        message: REVIEW.NOT_FOUND,
        status: STATUS.BAD_REQUEST,
      });
  } else {
    const newReviewScore = await reviewScoreServices.createReviewScore({
      review_id,
      user_id: req.user._id,
      vote,
    });
    if (!newReviewScore)
      throw new ErrorWithStatus({
        message: REVIEW.NOT_FOUND,
        status: STATUS.BAD_REQUEST,
      });
  }
  res.json({
    message: REVIEW.LIKE_DISLIKE_SUCCESS,
  });
};

module.exports = {
  createReview,
  updateReview,
  getAllReviewsRestaurant,
  deleteReview,
  reportReview,
  likeDislikeReview,
};
