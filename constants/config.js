const { config } = require("dotenv");

config();

const envConfig = {
  port: process.env.PORT || 4000,
  mongoURL: process.env.MONGODB_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectURI: process.env.REDIRECT_URI,
  refreshTokenGoogleDrive: process.env.REFRESH_TOKEN_GOOGLE_DRIVE,
  restaurant_folder_id: process.env.RESTAURANT_FOLDER_ID,
  food_folder_id: process.env.FOOD_FOLDER_ID,
  user_folder_id: process.env.USER_FOLDER_ID,
  review_folder_id: process.env.REVIEW_FOLDER_ID,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  graphHopperAPIKey: process.env.GRAPHHOPPER_API_KEY,
  graphHopperURL: process.env.GRAPHHOPPER_API,
  // mongoLocal: process.env.LOCALDB,
};

module.exports = {
  envConfig,
};
