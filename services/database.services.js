const mongoose = require("mongoose");
const { envConfig } = require("../constants/config");

const connectDB = async () => {
  try {
    const options = {};
    await mongoose.connect(
      envConfig.MONGODB_URI || envConfig.mongoURL,
      options
    );
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = { connectDB };
