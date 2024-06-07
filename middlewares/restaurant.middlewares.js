const { checkSchema } = require("express-validator");
const stream = require("stream");
const { ErrorWithStatus } = require("../utils/errors");
const { envConfig } = require("../constants/config");
const validate = require("../utils/validation");
const { RESTAURANT, USER } = require("../constants/message");
const STATUS = require("../constants/status");
const googleDriveURL = require("../utils/googleDriveURL");
const drive = require("../utils/googledrivecre");
const googleDriveUpload = async (req, res, next) => {
  req.fileURLs = [];
  const images = req.files;
  // console.log(images);
  for (const [key, value] of Object.entries(images)) {
    // console.log(value[0]);
    let image = value[0];
    let bufferStream = new stream.PassThrough();
    bufferStream.end(image.buffer);
    let tempRNG = Math.random();
    try {
      while (tempRNG === Math.random()) tempRNG = Math.random();
      let filename = Date.now() + tempRNG + "restaurant";
      filename = filename.replace(/\./g, "");
      const metaData = {
        name: filename + ".png",
        parents: [envConfig.restaurant_folder_id], // the ID of the folder you get from createFolder.js is used here
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
      next(new Error(RESTAURANT.IMAGES_UPLOAD_FAILED));
    }
  }
  next();
};

const restaurantImageValidator = async (req, res, next) => {
  // console.log(req.files);
  if (Object.keys(req.files).length !== 5)
    return next(new Error(RESTAURANT.NOT_CREATED));
  if (
    !("image" in req.files) ||
    !("image2" in req.files) ||
    !("image3" in req.files) ||
    !("image4" in req.files) ||
    !("image5" in req.files)
  )
    return next(new Error(RESTAURANT.NOT_CREATED));

  return next();
};
const createRestaurantSchemaValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isLength: {
        options: { max: 160 },
      },
      trim: true,
    },
    desc: {
      isLength: {
        options: { max: 3000 },
      },
      trim: true,
    },
    address: {
      notEmpty: true,
      isLength: {
        options: { max: 250 },
      },
      trim: true,
    },

    morning_open_time: {
      custom: {
        options: async (value, { req }) => {
          if (value === "") return true;
          if (value[2] !== ":" || value.length !== 5) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          let split = value.split(":");
          if (
            split[0].length !== 2 ||
            split[1].length !== 2 ||
            !/^\d+$/.test(split[0]) ||
            !/^\d+$/.test(split[1])
          ) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          return true;
        },
      },
      trim: true,
    },
    morning_closed_time: {
      custom: {
        options: async (value, { req }) => {
          if (value === "") return true;
          if (value[2] !== ":" || value.length !== 5) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          let split = value.split(":");
          if (
            split[0].length !== 2 ||
            split[1].length !== 2 ||
            !/^\d+$/.test(split[0]) ||
            !/^\d+$/.test(split[1])
          ) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          return true;
        },
      },
      trim: true,
    },
    afternoon_open_time: {
      custom: {
        options: async (value, { req }) => {
          if (value === "") return true;
          if (value[2] !== ":" || value.length !== 5) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          let split = value.split(":");
          if (
            split[0].length !== 2 ||
            split[1].length !== 2 ||
            !/^\d+$/.test(split[0]) ||
            !/^\d+$/.test(split[1])
          ) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          return true;
        },
      },
      trim: true,
    },
    afternoon_closed_time: {
      custom: {
        options: async (value, { req }) => {
          if (value === "") return true;
          if (value[2] !== ":" || value.length !== 5) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          let split = value.split(":");
          if (
            split[0].length !== 2 ||
            split[1].length !== 2 ||
            !/^\d+$/.test(split[0]) ||
            !/^\d+$/.test(split[1])
          ) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          return true;
        },
      },
      trim: true,
    },
    status: {
      isNumeric: true,
      custom: {
        options: async (value, { req }) => {
          if (value === "0" || value === "1") return true;
          else throw new Error(RESTAURANT.INVALID_REQUEST);
        },
      },
      trim: true,
    },
    lat: {
      notEmpty: true,
      custom: {
        options: async (value, { req }) => {
          if (!/^[0-9]+(\.)?[0-9]*$/.test(value)) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          return true;
        },
      },
      trim: true,
    },
    lng: {
      notEmpty: true,
      custom: {
        options: async (value, { req }) => {
          if (!/^[0-9]+(\.)?[0-9]*$/.test(value)) {
            throw new Error(RESTAURANT.INVALID_REQUEST);
          }
          return true;
        },
      },
      trim: true,
    },
  }),
  ["body"]
);

const createRestaurantDataValidator = async (req, res, next) => {
  let [morningOpenHour, morningOpenMinute] =
    req.body.morning_open_time.split(":");
  let [afternoonOpenHour, afternoonOpenMinute] =
    req.body.afternoon_open_time.split(":");
  let [morningClosedHour, morningClosedMinute] =
    req.body.morning_closed_time.split(":");
  let [afternoonClosedHour, afternoonClosedMinute] =
    req.body.afternoon_closed_time.split(":");
  morningOpenHour = parseInt(morningOpenHour);
  morningOpenMinute = parseInt(morningOpenMinute);
  morningClosedHour = parseInt(morningClosedHour);
  afternoonOpenHour = parseInt(afternoonOpenHour);
  afternoonOpenMinute = parseInt(afternoonOpenMinute);
  morningClosedMinute = parseInt(morningClosedMinute);
  afternoonClosedHour = parseInt(afternoonClosedHour);
  afternoonClosedMinute = parseInt(afternoonClosedMinute);

  if (
    morningOpenHour > 12 ||
    morningOpenHour < 0 ||
    morningClosedHour > 12 ||
    morningClosedHour < 0
  )
    return next(new Error(RESTAURANT.INVALID_TIME));
  if (
    afternoonOpenHour > 24 ||
    afternoonOpenHour < 12 ||
    afternoonClosedHour > 24 ||
    afternoonClosedHour < 12
  )
    return next(new Error(RESTAURANT.INVALID_TIME));
  if (
    morningOpenMinute < 0 ||
    morningOpenMinute > 59 ||
    morningClosedMinute < 0 ||
    morningClosedMinute > 59 ||
    afternoonOpenMinute < 0 ||
    afternoonOpenMinute > 59 ||
    afternoonClosedMinute < 0 ||
    afternoonClosedMinute > 59
  )
    return next(new Error(RESTAURANT.INVALID_TIME));
  if (morningOpenHour === 12 && morningOpenMinute !== 0)
    return next(new Error(RESTAURANT.INVALID_TIME));
  if (afternoonOpenHour === 24 && afternoonOpenMinute !== 0)
    return next(new Error(RESTAURANT.INVALID_TIME));
  if (morningOpenHour > morningClosedHour)
    return next(new Error(RESTAURANT.INVALID_TIME));
  else if (
    morningOpenHour === morningClosedHour &&
    morningOpenMinute >= morningClosedMinute
  )
    return next(new Error(RESTAURANT.INVALID_TIME));

  if (afternoonOpenHour > afternoonClosedHour)
    return next(new Error(RESTAURANT.INVALID_TIME));
  else if (
    afternoonOpenHour === afternoonClosedHour &&
    afternoonOpenMinute >= afternoonClosedMinute
  )
    return next(new Error(RESTAURANT.INVALID_TIME));
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

const getAllRestaurantsValidator = validate(
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
const searchRestaurantsAndFoodValidator = validate(
  checkSchema({
    search: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["query"]
);

const getRestaurantValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["params"]
);
const getAllUserRestaurantsValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["params"]
);

module.exports = {
  createRestaurantSchemaValidator,
  getAllRestaurantsValidator,
  getRestaurantValidator,
  tokenValidatingResult,
  restaurantImageValidator,
  googleDriveUpload,
  createRestaurantDataValidator,
  getAllUserRestaurantsValidator,
  searchRestaurantsAndFoodValidator,
};
