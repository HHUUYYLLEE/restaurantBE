const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const drive = require("../utils/googledrivecre");
const STATUS = require("../constants/status");
const stream = require("stream");
const { FOOD, USER } = require("../constants/message");
const { envConfig } = require("../constants/config");
const restaurantServices = require("../services/restaurant.services");
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

const foodImageValidator = function (req, res, next) {
  //   console.log(typeof req.file);
  if (req.file === undefined || req.file === null)
    return next(new Error(FOOD.INVALID_REQUEST));
  if (req.file.fieldname !== "image")
    return next(new Error(FOOD.INVALID_REQUEST));
  return next();
};

const createFoodFormValidator = validate(
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
    quantity: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (parseInt(value) === 0) return true;
          else throw new Error(FOOD.INVALID_REQUEST);
        },
      },
      trim: true,
    },
  }),
  ["body"]
);
const updateFoodFormValidator = validate(
  checkSchema({
    food_id: {
      notEmpty: true,

      trim: true,
    },
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
    sort: {
      optional: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (value && parseInt(value) !== -11 && parseInt(value) !== 1)
            throw new Error(FOOD.INVALID_REQUEST);

          return true;
        },
      },
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
const createFoodValidator = async (req, res, next) => {
  const restaurant = await restaurantServices.findRestaurantUserMatch(
    req.user._id,
    req.body.restaurant_id
  );
  if (!restaurant)
    return next(
      new ErrorWithStatus({
        message: FOOD.NOT_FOUND,
        status: STATUS.BAD_REQUEST,
      })
    );
  return next();
};
const updateFoodValidator = async (req, res, next) => {
  const food = await foodServices.getFood(req.body.food_id);
  if (!food)
    return next(
      new ErrorWithStatus({
        message: FOOD.NOT_FOUND,
        status: STATUS.BAD_REQUEST,
      })
    );
  const jsonFood = food.toJSON();
  const restaurant = await restaurantServices.findRestaurantUserMatch(
    req.user._id,
    jsonFood.restaurant_id
  );

  if (!restaurant)
    return next(
      new ErrorWithStatus({
        message: FOOD.NOT_FOUND,
        status: STATUS.BAD_REQUEST,
      })
    );
  req.food = jsonFood;
  return next();
};
module.exports = {
  createFoodFormValidator,
  updateFoodValidator,
  updateFoodFormValidator,
  createFoodValidator,
  getAllFoodInRestaurantValidator,
  getAllFoodValidator,
  tokenValidatingResult,
  foodImageValidator,
  getFoodValidator,
  googleDriveUpload,
};
