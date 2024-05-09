const { config } = require("dotenv");

config();

const envConfig = {
  port: process.env.PORT || 4000,
  mongoURL: process.env.MONGODB_URL,
  // mongoURI: process.env.MONGODB_URI,
  // clientID: process.env.CLIENT_ID,
  // clientSecret: process.env.CLIENT_SECRET,
  // redirectURI: process.env.REDIRECT_URI,
  // refreshToken: process.env.REFRESH_TOKEN,
};

module.exports = {
  envConfig,
};
