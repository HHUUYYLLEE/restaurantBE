const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const drive = require("../utils/googledrivecre");
const STATUS = require("../constants/status");
const stream = require("stream");
const { FOOD, USER, REVIEW } = require("../constants/message");
const { envConfig } = require("../constants/config");
const reviewServices = require("../services/review.services");
const { ErrorWithStatus } = require("../utils/errors");
const googleDriveURL = require("../utils/googleDriveURL");
const foodServices = require("../services/food.services");
const googleDriveUpload = async (req, res, next) => {
  const image = req.file;
  let bufferStream = new stream.PassThrough();
  bufferStream.end(image.buffer);
  try {
    let filename = Date.now() + Math.random() + "food";
    filename = filename.replace(/\./g, "");
    const metaData = {
      name: filename + ".png",
      parents: [envConfig.food_folder_id], // the ID of the folder you get from createFolder.js is used here
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

    req.fileURL = googleDriveURL(uploadFile.data.id);
  } catch (err) {
    return next(new Error(FOOD.IMAGE_UPLOAD_FAILED));
  }

  return next();
};
const tokenValidatingResult = async (req, res, next) => {
  if (req.user === undefined)
    return next(
      new ErrorWithStatus({
        message: USER.LOGIN_REQUIRED,
        status: STATUS.UNAUTHORIZED,
      })
    );

  return next();
};

const createReviewFormValidator = validate(
  checkSchema({
    restaurant_id: {
      notEmpty: true,
      isLength: {
        options: { max: 160 },
      },
      trim: true,
    },
    comment: {
      notEmpty: true,
      trim: true,
    },
    quality_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
    service_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
    location_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
    price_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
    area_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
  }),
  ["body"]
);
const updateReviewFormValidator = validate(
  checkSchema({
    review_id: {
      notEmpty: true,
      trim: true,
    },
    quality_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
    service_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
    location_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
    price_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
    area_score: {
      notEmpty: true,
      trim: true,
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 1 && parseInt(value) <= 10) return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
  }),
  ["body"]
);

const getAllReviewsRestaurantValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
  })
);
const createReviewValidator = async (req, res, next) => {
  return next();
};
const updateReviewValidator = async (req, res, next) => {
  const { review_id } = req.body;
  const review = reviewServices.getReview(review_id);
  if (!review)
    return next(
      new ErrorWithStatus({
        message: REVIEW.NOT_FOUND,
        status: STATUS.BAD_REQUEST,
      })
    );
  if (review.user_id !== req.user._id)
    return next(
      new ErrorWithStatus({
        message: REVIEW.NOT_FOUND,
        status: STATUS.BAD_REQUEST,
      })
    );
  req.review = review;
  return next();
};
const likeDislikeReviewValidator = validate(
  checkSchema({
    review_id: {
      notEmpty: true,
      trim: true,
    },
    vote: {
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (value === "like" || value === "dislike" || value === "none")
            return true;
          else throw new Error(REVIEW.INVALID_REQUEST);
        },
      },
    },
  })
);
module.exports = {
  getAllReviewsRestaurantValidator,
  createReviewValidator,
  updateReviewValidator,
  updateReviewFormValidator,
  createReviewFormValidator,

  tokenValidatingResult,

  googleDriveUpload,
};
