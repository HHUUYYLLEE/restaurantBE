const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const { RESTAURANT } = require("../constants/message");

const restaurantImageValidator = function (req, res, next) {
  if (Object.keys(req.files).length !== 5) {
    throw new Error(RESTAURANT.INVALID_REQUEST);
  } else if (
    !("image" in req.files) ||
    !("image2" in req.files) ||
    !("image3" in req.files) ||
    !("image4" in req.files) ||
    !("image5" in req.files)
  )
    throw new Error(RESTAURANT.INVALID_REQUEST);
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
};
