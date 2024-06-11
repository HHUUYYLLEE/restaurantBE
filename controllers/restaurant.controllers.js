const { RESTAURANT, USER, FOOD } = require("../constants/message");
const STATUS = require("../constants/status");
const { ErrorWithStatus } = require("../utils/errors");
const restaurantServices = require("../services/restaurant.services");
const restaurantSubImagesServices = require("../services/restaurant_sub_images.services");
const userServices = require("../services/user.services");
const foodServices = require("../services/food.services");
const reviewServices = require("../services/review.services");
const reviewScoreServices = require("../services/review_score.services");
const axios = require("axios");
const googleDriveURL = require("../utils/googleDriveURL");
const drive = require("../utils/googledrivecre");
const { envConfig } = require("../constants/config");
const stream = require("stream");

const {
  updateRestaurantSchemaValidator,
} = require("../middlewares/restaurant.middlewares");
const createRestaurant = async (req, res) => {
  let {
    name,
    desc,
    address,
    morning_open_time,
    morning_closed_time,
    afternoon_open_time,
    afternoon_closed_time,
    status,
    lat,
    lng,
    table_chair,
    category,
  } = req.body;

  const user_id = req.user._id;
  const newRestaurant = await restaurantServices.createRestaurant({
    name,
    desc,
    address,
    user_id,
    morning_open_time,
    morning_closed_time,
    afternoon_open_time,
    afternoon_closed_time,
    status,
    category,
    main_avatar_url: req.fileURLs[0],
    lat,
    lng,
    table_chair,
  });
  if (!newRestaurant) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_CREATED,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  } else
    await restaurantSubImagesServices.createRestaurantSubImages({
      restaurant_id: newRestaurant._id,
      images: req.fileURLs.slice(1, 5),
    });
  res.json({ message: RESTAURANT.CREATED, newRestaurant });
};

const getAllConditionRestaurants = async (req, res) => {
  let { address, page, limit, category, sortByScore, chair, table } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  let conditions = {};
  let queryArray = [];
  if (category || address || chair) {
    if (category && category.length > 0) {
      category.map((data) => {
        queryArray.push({
          category: { $regex: data, $options: "i" },
        });
      });
    }
    if (address)
      queryArray.push({ address: { $regex: address, $options: "i" } });
    if (chair && table)
      queryArray.push({
        table_chair: {
          $elemMatch: {
            chair: { $gte: parseInt(chair) },
            table: { $gte: parseInt(table) },
          },
        },
      });
    conditions = { $and: queryArray };
  }
  const restaurants = await restaurantServices.getAllConditionRestaurants(
    conditions
  );
  if (restaurants.length === 0) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  var totalPages = restaurants.length;
  const restaurantsData = [...restaurants];
  var sortByScoresRestaurants = [];
  const modifiedRestaurantsData = await Promise.all(
    restaurantsData.map(async (data) => {
      data = data.toObject();
      var var_quality_score = 0,
        var_service_score = 0,
        var_location_score = 0,
        var_price_score = 0,
        var_area_score = 0,
        quality_score = 0,
        service_score = 0,
        location_score = 0,
        price_score = 0,
        area_score = 0,
        average_score = 0;
      const reviews = await reviewServices.getAllReviewsInRestaurant(data._id);
      if (reviews.length === 0)
        return {
          ...data,
          quality_score,
          service_score,
          location_score,
          price_score,
          area_score,
          average_score,
        };
      for (const review of reviews) {
        var_quality_score += review.toObject().quality_score || 0;
        var_service_score += review.toObject().service_score || 0;
        var_location_score += review.toObject().location_score || 0;
        var_price_score += review.toObject().price_score || 0;
        var_area_score += review.toObject().area_score || 0;
      }

      average_score =
        Math.round(
          ((var_quality_score / reviews.length +
            var_service_score / reviews.length +
            var_location_score / reviews.length +
            var_price_score / reviews.length +
            var_area_score / reviews.length) /
            5) *
            10
        ) / 10;
      quality_score =
        Math.round((var_quality_score / reviews.length) * 10) / 10;
      service_score =
        Math.round((var_service_score / reviews.length) * 10) / 10;
      location_score =
        Math.round((var_location_score / reviews.length) * 10) / 10;
      price_score = Math.round((var_price_score / reviews.length) * 10) / 10;
      area_score = Math.round((var_area_score / reviews.length) * 10) / 10;
      if (parseInt(sortByScore) === Math.floor(average_score))
        sortByScoresRestaurants.push({
          ...data,
          quality_score,
          service_score,
          location_score,
          price_score,
          area_score,
          average_score,
        });

      return {
        ...data,
        quality_score,
        service_score,
        location_score,
        price_score,
        area_score,
        average_score,
      };
    })
  );
  // console.log(modifiedRestaurantsData);
  if (parseInt(sortByScore)) {
    if (sortByScoresRestaurants.length === 0)
      throw new ErrorWithStatus({
        message: RESTAURANT.NOT_FOUND,
        status: STATUS.NOT_FOUND,
      });
    totalPages = 1 + Math.floor(sortByScoresRestaurants.length / limit);
    res.json({
      message: RESTAURANT.FOUND,
      restaurants: sortByScoresRestaurants.slice(
        (page - 1) * limit,
        page * limit
      ),
      totalPages,
      page,
      limit,
    });
  } else {
    res.json({
      message: RESTAURANT.FOUND,
      restaurants: modifiedRestaurantsData.slice(
        (page - 1) * limit,
        page * limit
      ),
      totalPages: 1 + Math.floor(modifiedRestaurantsData.length / limit),
      page,
      limit,
    });
  }
};
const getRandomRestaurants = async (req, res) => {
  const restaurants = await restaurantServices.getAllRestaurants();
  if (restaurants.length === 0) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }

  for (let i = restaurants.restaurants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [restaurants.restaurants[i], restaurants.restaurants[j]] = [
      restaurants.restaurants[j],
      restaurants.restaurants[i],
    ];
  }
  restaurants.restaurants.splice(10);
  res.json({
    message: RESTAURANT.FOUND,
    restaurants,
  });
};
const getRestaurant = async (req, res) => {
  const { id } = req.params;
  const restaurant = await restaurantServices.getRestaurant(id);
  if (!restaurant) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  const restaurantSubImages =
    await restaurantSubImagesServices.findRestaurantSubImages(id);
  // console.log(restaurantSubImages);
  let restaurantData = restaurant.toObject();
  restaurantData.images = restaurantSubImages.toJSON().images;
  const reviews = await reviewServices.getAllReviewsInRestaurant(id);
  var reviewsData = [];
  if (reviews.length > 0) reviewsData = [...reviews];
  var var_quality_score = 0,
    var_service_score = 0,
    var_location_score = 0,
    var_price_score = 0,
    var_area_score = 0;
  restaurantData.quality_score = 0;
  restaurantData.service_score = 0;
  restaurantData.location_score = 0;
  restaurantData.price_score = 0;
  restaurantData.area_score = 0;
  restaurantData.average_score = 0;

  for (const review of reviewsData) {
    var_quality_score += review.toObject().quality_score || 0;
    var_service_score += review.toObject().service_score || 0;
    var_location_score += review.toObject().location_score || 0;
    var_price_score += review.toObject().price_score || 0;
    var_area_score += review.toObject().area_score || 0;
  }

  restaurantData.average_score =
    Math.round(
      ((var_quality_score / reviews.length +
        var_service_score / reviews.length +
        var_location_score / reviews.length +
        var_price_score / reviews.length +
        var_area_score / reviews.length) /
        5) *
        10
    ) / 10;
  restaurantData.quality_score =
    Math.round((var_quality_score / reviews.length) * 10) / 10;
  restaurantData.service_score =
    Math.round((var_service_score / reviews.length) * 10) / 10;
  restaurantData.location_score =
    Math.round((var_location_score / reviews.length) * 10) / 10;
  restaurantData.price_score =
    Math.round((var_price_score / reviews.length) * 10) / 10;
  restaurantData.area_score =
    Math.round((var_area_score / reviews.length) * 10) / 10;
  const modifiedReviewsData = await Promise.all(
    reviewsData.map(async (data) => {
      data = data.toObject();
      data.userLikeDislike = "";
      data.likeCounter = 0;
      const user = await userServices.getUserFromId(data.user_id);
      data.username = user.username;
      data.avatar_url = user.avatar_url;
      const reviewScores = await reviewScoreServices.getAllReviewScoresOfReview(
        data._id
      );
      for (const score of reviewScores) {
        if (req.user) {
          if (score.user_id === req.user._id) data.userLikeDislike = score.vote;
        }
        switch (score.vote) {
          case "like":
            data.likeCounter++;
            break;
          case "dislike":
            data.likeCounter--;
            break;
          default:
            break;
        }
      }
      return data;
    })
  );

  res.json({
    message: RESTAURANT.FOUND,
    restaurant: restaurantData,
    reviews: modifiedReviewsData,
  });
};
const getAllUserRestaurants = async (req, res) => {
  const { id } = req.params;
  const restaurants = await restaurantServices.findAllUserRestaurants(id);
  if (restaurants.length === 0) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  res.json({ message: RESTAURANT.FOUND_ALL, restaurants });
};

const searchRestaurantsAndFood = async (req, res) => {
  let {
    search,
    address,
    mode,
    page,
    limit,
    category,
    sortByScore,
    sortByPrice,
    chair,
    table,
  } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  let conditions = {};
  let queryArray = [];
  // console.log(mode);
  switch (parseInt(mode)) {
    case 1:
      if (category || address || chair) {
        if (category && category.length > 0) {
          category.map((data) => {
            queryArray.push({
              category: { $regex: data, $options: "i" },
            });
          });
        }
        if (address)
          queryArray.push({ address: { $regex: address, $options: "i" } });
        if (chair && table)
          queryArray.push({
            table_chair: {
              $elemMatch: {
                chair: { $gte: parseInt(chair) },
                table: { $gte: parseInt(table) },
              },
            },
          });
        conditions = { $and: queryArray };
      }
      const restaurants = await restaurantServices.getAllConditionRestaurants(
        conditions
      );
      if (restaurants.length === 0) {
        throw new ErrorWithStatus({
          message: RESTAURANT.NOT_FOUND,
          status: STATUS.NOT_FOUND,
        });
      }
      var totalPages = restaurants.length;
      const restaurantsData = [...restaurants];
      var sortByScoresRestaurants = [];
      const modifiedRestaurantsData = await Promise.all(
        restaurantsData.map(async (data) => {
          data = data.toObject();
          var var_quality_score = 0,
            var_service_score = 0,
            var_location_score = 0,
            var_price_score = 0,
            var_area_score = 0,
            quality_score = 0,
            service_score = 0,
            location_score = 0,
            price_score = 0,
            area_score = 0,
            average_score = 0;
          const reviews = await reviewServices.getAllReviewsInRestaurant(
            data._id
          );
          if (reviews.length === 0)
            return {
              ...data,
              quality_score,
              service_score,
              location_score,
              price_score,
              area_score,
              average_score,
            };
          for (const review of reviews) {
            var_quality_score += review.toObject().quality_score || 0;
            var_service_score += review.toObject().service_score || 0;
            var_location_score += review.toObject().location_score || 0;
            var_price_score += review.toObject().price_score || 0;
            var_area_score += review.toObject().area_score || 0;
          }

          average_score =
            Math.round(
              ((var_quality_score / reviews.length +
                var_service_score / reviews.length +
                var_location_score / reviews.length +
                var_price_score / reviews.length +
                var_area_score / reviews.length) /
                5) *
                10
            ) / 10;
          quality_score =
            Math.round((var_quality_score / reviews.length) * 10) / 10;
          service_score =
            Math.round((var_service_score / reviews.length) * 10) / 10;
          location_score =
            Math.round((var_location_score / reviews.length) * 10) / 10;
          price_score =
            Math.round((var_price_score / reviews.length) * 10) / 10;
          area_score = Math.round((var_area_score / reviews.length) * 10) / 10;
          if (parseInt(sortByScore) === Math.floor(average_score))
            sortByScoresRestaurants.push({
              ...data,
              quality_score,
              service_score,
              location_score,
              price_score,
              area_score,
              average_score,
            });

          return {
            ...data,
            quality_score,
            service_score,
            location_score,
            price_score,
            area_score,
            average_score,
          };
        })
      );
      // console.log(modifiedRestaurantsData);
      if (parseInt(sortByScore)) {
        if (sortByScoresRestaurants.length === 0)
          throw new ErrorWithStatus({
            message: RESTAURANT.NOT_FOUND,
            status: STATUS.NOT_FOUND,
          });
        totalPages = 1 + Math.floor(sortByScoresRestaurants.length / limit);
        res.json({
          message: RESTAURANT.FOUND,
          restaurants: sortByScoresRestaurants.slice(
            (page - 1) * limit,
            page * limit
          ),
          totalPages,
          page,
          limit,
        });
      } else {
        res.json({
          message: RESTAURANT.FOUND,
          restaurants: modifiedRestaurantsData.slice(
            (page - 1) * limit,
            page * limit
          ),
          totalPages: 1 + Math.floor(modifiedRestaurantsData.length / limit),
          page,
          limit,
        });
      }
      break;
    case 2:
      if (parseInt(sortByPrice))
        conditions = {
          name: {
            $regex: search,
            $options: "i",
          },
        };
      else conditions = { name: { $regex: search, $options: "i" } };
      // console.log(sortByPrice);
      const { allFood, totalPages: totalPages2 } =
        await foodServices.getAllFood({
          conditions,
          sortByPrice,
          page,
          limit,
        });
      if (allFood.length === 0)
        throw new ErrorWithStatus({
          message: FOOD.NOT_FOUND,
          status: STATUS.NOT_FOUND,
        });
      res.json({
        message: FOOD.FOUND,
        allFood,
        totalPages: totalPages2,
      });
      break;
    default:
      throw new ErrorWithStatus({
        message: RESTAURANT.NOT_FOUND + " and " + FOOD.NOT_FOUND,
        status: STATUS.NOT_FOUND,
      });
  }
};

const findNearbyRestaurants = async (req, res) => {
  var {
    lat,
    lng,
    radius,
    unit,
    address,
    page,
    limit,
    category,
    sortByScore,
    chair,
    table,
  } = req.query;
  if (unit === "km") radius *= 1000;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  let conditions = {};
  let queryArray = [];
  var restaurantsData = [];
  if (category || address || chair) {
    if (category && category.length > 0) {
      category.map((data) => {
        queryArray.push({
          category: { $regex: data, $options: "i" },
        });
      });
    }
    if (address)
      queryArray.push({ address: { $regex: address, $options: "i" } });
    if (chair && table)
      queryArray.push({
        table_chair: {
          $elemMatch: {
            chair: { $gte: parseInt(chair) },
            table: { $gte: parseInt(table) },
          },
        },
      });
    conditions = { $and: queryArray };
  }
  const restaurants = await restaurantServices.getAllConditionRestaurants(
    conditions
  );
  if (restaurants.length === 0) {
    throw new ErrorWithStatus({
      message: RESTAURANT.NOT_FOUND,
      status: STATUS.NOT_FOUND,
    });
  }
  for (const restaurant of restaurants) {
    try {
      const response = await axios.get(
        envConfig.graphHopperURL +
          "route?point=" +
          lat +
          "," +
          lng +
          "&point=" +
          restaurant.lat +
          "," +
          restaurant.lng +
          "&locale=en&calc_points=false&key=" +
          envConfig.graphHopperAPIKey
      );
      const data = response.data;
      if (data.paths[0].distance <= radius) {
        var temp = restaurant;
        temp._doc.distance = data.paths[0].distance;

        restaurantsData.push(temp);
      }
    } catch (error) {}
  }
  var sortByScoresRestaurants = [];
  const modifiedRestaurantsData = await Promise.all(
    restaurantsData.map(async (data) => {
      data = data.toObject();
      var var_quality_score = 0,
        var_service_score = 0,
        var_location_score = 0,
        var_price_score = 0,
        var_area_score = 0,
        quality_score = 0,
        service_score = 0,
        location_score = 0,
        price_score = 0,
        area_score = 0,
        average_score = 0;
      const reviews = await reviewServices.getAllReviewsInRestaurant(data._id);
      if (reviews.length === 0)
        return {
          ...data,
          quality_score,
          service_score,
          location_score,
          price_score,
          area_score,
          average_score,
        };
      for (const review of reviews) {
        var_quality_score += review.toObject().quality_score || 0;
        var_service_score += review.toObject().service_score || 0;
        var_location_score += review.toObject().location_score || 0;
        var_price_score += review.toObject().price_score || 0;
        var_area_score += review.toObject().area_score || 0;
      }

      average_score =
        Math.round(
          ((var_quality_score / reviews.length +
            var_service_score / reviews.length +
            var_location_score / reviews.length +
            var_price_score / reviews.length +
            var_area_score / reviews.length) /
            5) *
            10
        ) / 10;
      quality_score =
        Math.round((var_quality_score / reviews.length) * 10) / 10;
      service_score =
        Math.round((var_service_score / reviews.length) * 10) / 10;
      location_score =
        Math.round((var_location_score / reviews.length) * 10) / 10;
      price_score = Math.round((var_price_score / reviews.length) * 10) / 10;
      area_score = Math.round((var_area_score / reviews.length) * 10) / 10;
      if (sortByScore && parseInt(sortByScore) === Math.floor(average_score))
        sortByScoresRestaurants.push({
          ...data,
          quality_score,
          service_score,
          location_score,
          price_score,
          area_score,
          average_score,
        });

      return {
        ...data,
        quality_score,
        service_score,
        location_score,
        price_score,
        area_score,
        average_score,
      };
    })
  );
  // console.log(modifiedRestaurantsData);
  if (parseInt(sortByScore)) {
    if (sortByScoresRestaurants.length === 0)
      throw new ErrorWithStatus({
        message: RESTAURANT.NOT_FOUND,
        status: STATUS.NOT_FOUND,
      });
    totalPages = 1 + Math.floor(sortByScoresRestaurants.length / limit);
    res.json({
      message: RESTAURANT.FOUND,
      restaurants: sortByScoresRestaurants.slice(
        (page - 1) * limit,
        page * limit
      ),
      totalPages,
      page,
      limit,
    });
  } else {
    res.json({
      message: RESTAURANT.FOUND,
      restaurants: modifiedRestaurantsData.slice(
        (page - 1) * limit,
        page * limit
      ),
      totalPages: 1 + Math.floor(modifiedRestaurantsData.length / limit),
      page,
      limit,
    });
  }
};
const updateRestaurant = async (req, res) => {
  const {
    name,
    desc,
    address,
    morning_open_time,
    morning_closed_time,
    afternoon_open_time,
    afternoon_closed_time,
    status,
    lat,
    lng,
    table_chair,
    category,
  } = req.body;
  const restaurant_id = req.restaurant._id;
  if (req.restaurant.main_avatar_url.includes("drive.google.com/thumbnail"))
    await drive.files.delete({
      fileId: req.restaurant.main_avatar_url.split(
        "drive.google.com/thumbnail?id="
      )[1],
    });
  for (const url of req.restaurantSubImages.images) {
    if (url.includes("drive.google.com/thumbnail"))
      await drive.files.delete({
        fileId: url.split("drive.google.com/thumbnail?id=")[1],
      });
  }
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
      throw new Error(RESTAURANT.IMAGES_UPLOAD_FAILED);
    }
  }
  const newRestaurant = await restaurantServices.updateRestaurant(
    restaurant_id,
    {
      name,
      desc,
      address,
      morning_open_time,
      morning_closed_time,
      afternoon_open_time,
      afternoon_closed_time,
      status,
      category,
      main_avatar_url: req.fileURLs[0],
      lat,
      lng,
      table_chair,
    }
  );
  if (!newRestaurant) {
    throw new ErrorWithStatus({
      message: RESTAURANT.UPDATE_FAILED,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  } else
    await restaurantSubImagesServices.updateRestaurantSubImages(restaurant_id, {
      images: req.fileURLs.slice(1, 5),
    });

  res.json({ message: RESTAURANT.UPDATED, newRestaurant });
};
const getAllBloggerReviewsRestaurant = async (req, res) => {
  const restaurants = await restaurantServices.getAllRestaurants();
  var modifiedRestaurantsData = [];
  restaurants.map(async (data) => {
    data.bloggerReviews = [];
    const reviews = await reviewServices.getAllReviewsInRestaurant(data._id);
    for (const review of reviews)
      if (review.by_famous_reviewer === "true")
        data.bloggerReviews.push(review);
    for (let i = data.bloggerReviews.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data.bloggerReviews[i], data.bloggerReviews[j]] = [
        data.bloggerReviews[j],
        data.bloggerReviews[i],
      ];
    }
    if (data.bloggerReviews.length !== 0) modifiedRestaurantsData.push(data);
  });
  res.json({
    message: RESTAURANT.FOUND,
    restaurant: modifiedRestaurantsData,
  });
};
module.exports = {
  findNearbyRestaurants,
  createRestaurant,
  getAllConditionRestaurants,
  getRestaurant,
  getAllUserRestaurants,
  searchRestaurantsAndFood,
  getRandomRestaurants,
  updateRestaurant,
};
