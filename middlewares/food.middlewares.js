const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const drive = require("../utils/googledrivecre");
const STATUS = require("../constants/status");
const stream = require("stream");
const { FOOD } = require("../constants/message");
const { envConfig } = require("../constants/config");

const googleDriveUpload = async (req, res, next) => {
  const image = req.file;
  let bufferStream = new stream.PassThrough();
  bufferStream.end(image.buffer);
  try {
    let filename = Date.now() + Math.random() + "food";
    filename = filename.replace(/\./g, "");
    const metaData = {
      name: filename + ".jpg",
      parents: [envConfig.food_folder_id], // the ID of the folder you get from createFolder.js is used here
    };
    const media = {
      mimeType: "image/jpeg",
      body: bufferStream, // the image sent through multer will be uploaded to Drive
    };

    // uploading the file
    const uploadFile = await drive.files.create({
      resource: metaData,
      media: media,
      fields: "id",
    });

    req.fileID = uploadFile.data.id;
  } catch (err) {
    next(new Error(FOOD.IMAGE_UPLOAD_FAILED));
  }

  next();
};

const foodImageValidator = function (req, res, next) {
  //   console.log(typeof req.file);
  if (req.file === undefined || req.file === null)
    next(new Error(FOOD.INVALID_REQUEST));
  if (req.file.fieldname !== "image") next(new Error(FOOD.INVALID_REQUEST));
  next();
};

const createFoodValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isLength: {
        options: { max: 160 },
      },
      trim: true,
    },
    desc: {
      notEmpty: true,
      isLength: {
        options: { max: 1000 },
      },
      trim: true,
    },
    restaurant_id: {
      notEmpty: true,
      trim: true,
    },
    status: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (value === "0" || value === "1") return true;
          else throw new Error(FOOD.INVALID_REQUEST);
        },
      },
      trim: true,
    },
    price: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) > 0) return true;
          else throw new Error(FOOD.INVALID_REQUEST);
        },
      },
      trim: true,
    },
    quantity: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) >= 0) return true;
          else throw new Error(FOOD.INVALID_REQUEST);
        },
      },
      trim: true,
    },
  }),
  ["body"]
);
const getAllFoodValidator = validate(
  checkSchema({
    search: {
      optional: true,
      trim: true,
    },
    page: {
      optional: true,
      trim: true,
    },
    limit: {
      optional: true,
      trim: true,
    },
  }),
  ["query"]
);
const getAllFoodInRestaurantValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
    page: {
      optional: true,
      trim: true,
    },
    limit: {
      optional: true,
      trim: true,
    },
  }),
  ["query"]
);
const getFoodValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["params"]
);

module.exports = {
  createFoodValidator,
  getAllFoodInRestaurantValidator,
  getAllFoodValidator,
  foodImageValidator,
  getFoodValidator,
  googleDriveUpload,
};
