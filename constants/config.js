const { config } = require("dotenv");

config();

const envConfig = {
  port: process.env.PORT || 4000,
  mongoURL: process.env.MONGODB_URL,
  mongoURI: process.env.MONGODB_URI,
};

module.exports = {
  envConfig,
};
