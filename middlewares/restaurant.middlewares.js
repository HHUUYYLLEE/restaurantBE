const { checkSchema } = require("express-validator");
const { google } = require("googleapis");
const stream = require("stream");
const validate = require("../utils/validation");
const { RESTAURANT } = require("../constants/message");
const STATUS = require("../constants/status");
const { envConfig } = require("../constants/config");
const googleDriveUpload = async (req, res, next) => {
  req.fileIDs = [];
  const images = req.files;
  // console.log(images);
  const oauth2Client = new google.auth.OAuth2(
    envConfig.clientID,
    envConfig.clientSecret,
    envConfig.redirectURI
  );
  oauth2Client.setCredentials({ refresh_token: envConfig.refreshToken });
  const drive = google.drive({ version: "v3", auth: oauth2Client });
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
        name: filename + ".jpg",
        parents: [envConfig.restaurant_folder_id], // the ID of the folder you get from createFolder.js is used here
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

      // console.log("ID:", uploadFile.data.id);
      req.fileIDs.push(uploadFile.data.id);
      // console.log("fileIDs:");
      // console.log(req.fileIDs);
    } catch (err) {
      next(new Error(RESTAURANT.IMAGES_UPLOAD_FAILED));
    }
  }
  next();
};

const restaurantImageValidator = async (req, res, next) => {
  console.log(req.files);
  if (Object.keys(req.files).length !== 5)
    next(new Error(RESTAURANT.NOT_CREATED));
  if (
    !("image" in req.files) ||
    !("image2" in req.files) ||
    !("image3" in req.files) ||
    !("image4" in req.files) ||
    !("image5" in req.files)
  )
    next(new Error(RESTAURANT.NOT_CREATED));

  next();
};
const createRestaurantValidator = validate(
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
    address: {
      notEmpty: true,
      isLength: {
        options: { max: 250 },
      },
      trim: true,
    },
    user_id: {
      notEmpty: true,
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

const getRestaurantValidator = validate(
  checkSchema({
    id: {
      notEmpty: true,
      trim: true,
    },
  }),
  ["params"]
);

module.exports = {
  createRestaurantValidator,
  getAllRestaurantsValidator,
  getRestaurantValidator,
  restaurantImageValidator,
  googleDriveUpload,
};
