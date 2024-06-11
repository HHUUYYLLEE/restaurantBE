const { FOOD } = require("../constants/message");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const foodServices = require("../services/food.services");
const restaurantServices = require("../services/restaurant.services");
const googleDriveURL = require("../utils/googleDriveURL");
const drive = require("../utils/googledrivecre");
const { envConfig } = require("../constants/config");
const stream = require("stream");

const createFood = async (req, res) => {
  const { restaurant_id, name, desc, status, price, quantity } = req.body;
  const newFood = await foodServices.createFood({
    restaurant_id,
    name,
    desc,
    status,
    price,
    quantity,
    image_url: req.fileURL,
  });
  if (!newFood) {
    throw new ErrorWithStatus({
      message: FOOD.NOT_CREATED,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
  res.json({ message: FOOD.CREATED, newFood });
};
const updateFood = async (req, res) => {
  const { food_id, name, desc, status, price, quantity } = req.body;
  const image = req.file;
  if (req.food.image_url.includes("drive.google.com/thumbnail"))
    await drive.files.delete({
      fileId: req.food.image_url.split("drive.google.com/thumbnail?id=")[1],
    });
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
    throw new ErrorWithStatus({
      message: FOOD.IMAGE_UPLOAD_FAILED,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
  const food = await foodServices.updateFood(food_id, {
    name,
    desc,
    status,
    price,
    quantity,
    image_url: req.fileURL,
  });
  if (!food) {
    throw new ErrorWithStatus({
      message: FOOD.UPDATE_FAILED,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
  res.json({ message: FOOD.UPDATE_SUCCESS, food });
};
const getAllFood = async (req, res) => {
  let { search, sortByPrice, page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  let conditions = {};
  if (search) {
    conditions.$or = [
      { name: { $regex: search, $options: "i" } },
      // { describe: { $regex: search, $options: "i" } },
      // { full_field: { $regex: search, $options: "i" } },
    ];
  }
  // console.log(conditions);
  const { allFood, totalPage } = await foodServices.getAllFood({
    conditions,
    sortByPrice,
    page,
    limit,
  });
  if (!allFood) {
    throw new ErrorWithStatus({
      message: FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({
    message: FOOD.FOUND,
    allFood,
    totalPage,
    page,
    limit,
  });
};

const getFood = async (req, res) => {
  const { id } = req.params;
  const food = await foodServices.getFood(id);
  if (!food) {
    throw new ErrorWithStatus({
      message: FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({ message: FOOD.FOUND, food });
};

const getAllFoodInRestaurant = async (req, res) => {
  const { id } = req.params;
  let { page, limit } = req.query;
  // console.log(id);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const { allFoodInRestaurant, totalPages } =
    await foodServices.getAllFoodInRestaurant(id, page, limit);
  if (!allFoodInRestaurant) {
    throw new ErrorWithStatus({
      message: FOOD.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({
    message: FOOD.FOUND,
    allFood: allFoodInRestaurant,
    totalPages,
    page,
    limit,
  });
};

module.exports = {
  createFood,
  getAllFood,
  getFood,
  getAllFoodInRestaurant,
  updateFood,
};
