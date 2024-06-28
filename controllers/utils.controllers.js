const { envConfig } = require("../constants/config");

const getEnv = async (req, res) => {
  res.json({
    port: envConfig.port,
    mongoURL: envConfig.mongoURL,
    clientID: envConfig.clientID,
    clientSecret: envConfig.clientSecret,
    redirectURI: envConfig.redirectURI,
    refreshTokenGoogleDrive: envConfig.refreshTokenGoogleDrive,
    restaurant_folder_id: envConfig.restaurant_folder_id,
    food_folder_id: envConfig.food_folder_id,
    user_folder_id: envConfig.user_folder_id,
    review_folder_id: envConfig.review_folder_id,
    accessTokenSecret: envConfig.accessTokenSecret,
    refreshTokenSecret: envConfig.refreshTokenSecret,
    graphHopperAPIKey: envConfig.graphHopperAPIKey,
    graphHopperURL: envConfig.graphHopperURL,
    frontendVercel: envConfig.frontendVercel,
  });
};

module.exports = { getEnv };
