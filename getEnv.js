const axios = require("axios");
const fs = require("fs");
axios
  .get("https://restaurantbe-huyle-2a11ba84.koyeb.app/api/utils/env")
  .then((res) => {
    const data =
      "PORT=" +
      res.data.port +
      "\n" +
      "MONGODB_URL=" +
      res.data.mongoURL +
      "\n" +
      "CLIENT_ID=" +
      res.data.clientID +
      "\n" +
      "CLIENT_SECRET=" +
      res.data.clientSecret +
      "\n" +
      "REDIRECT_URI=" +
      res.data.redirectURI +
      "\n" +
      "REFRESH_TOKEN_GOOGLE_DRIVE=" +
      res.data.refreshTokenGoogleDrive +
      "\n" +
      "RESTAURANT_FOLDER_ID=" +
      res.data.restaurant_folder_id +
      "\n" +
      "FOOD_FOLDER_ID=" +
      res.data.food_folder_id +
      "\n" +
      "USER_FOLDER_ID=" +
      res.data.user_folder_id +
      "\n" +
      "REVIEW_FOLDER_ID=" +
      res.data.review_folder_id +
      "\n" +
      "ACCESS_TOKEN_SECRET=" +
      res.data.accessTokenSecret +
      "\n" +
      "REFRESH_TOKEN_SECRET=" +
      res.data.refreshTokenSecret +
      "\n" +
      "GRAPHHOPPER_API_KEY=" +
      res.data.graphHopperAPIKey +
      "\n" +
      "GRAPHHOPPER_API=" +
      res.data.graphHopperURL +
      "\n" +
      "FRONTEND_VERCEL=" +
      res.data.frontendVercel;
    fs.writeFile("./.env", data, (err) => {});
  });
