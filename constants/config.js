const { config } = require("dotenv");

config();

const envConfig = {
  port: process.env.PORT || 4000,
  mongoURL: process.env.MONGODB_URL,
  // mongoURI: process.env.MONGODB_URI,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectURI: process.env.REDIRECT_URI,
  refreshTokenGoogleDrive: process.env.REFRESH_TOKEN_GOOGLE_DRIVE,
  restaurant_folder_id: process.env.RESTAURANT_FOLDER_ID,
  food_folder_id: process.env.FOOD_FOLDER_ID,
};

module.exports = {
  envConfig,
};
