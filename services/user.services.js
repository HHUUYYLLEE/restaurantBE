const UserModel = require("../models/user.schemas");

class UserServices {
  async createUser(obj) {
    const newUser = await UserModel.create(obj);
    return newUser;
  }

  async getUser(id) {
    const user = await UserModel.findById(id);
    return user;
  }
}

const userServices = new UserServices();
module.exports = userServices;
