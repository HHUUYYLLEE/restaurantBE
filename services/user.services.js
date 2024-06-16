const UserModel = require("../models/user.schemas");
const { envConfig } = require("../constants/config");
const jwt = require("jsonwebtoken");

class UserServices {
  async login(user) {
    const accessToken = await jwt.sign(
      {
        _id: user._id,

        email: user.email,
      },
      envConfig.accessTokenSecret,
      { expiresIn: "10d" }
    );
    delete user.password;
    const data = {
      accessToken: "Bearer " + accessToken,
      user,
    };
    return data;
  }

  async createUser(obj) {
    const newUser = await UserModel.create(obj);
    return newUser;
  }

  async getUserFromId(id) {
    const user = await UserModel.findById(id);
    return user;
  }
  async getUserFromEmail(email) {
    const user = await UserModel.findOne({ email: email });
    return user;
  }
  async findRefreshToken(token) {
    const user = await UserModel.findOne({ refresh_token: token });
    return user;
  }
  async updateUser(id, data) {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    return user;
  }
  async getAllUsers(conditions) {
    if (conditions) return await UserModel.find(conditions);
    else return await UserModel.find();
  }
}

const userServices = new UserServices();
module.exports = userServices;
