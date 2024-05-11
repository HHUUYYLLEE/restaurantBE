const { USER } = require("../constants/message");
const userServices = require("../services/user.services");
const bcrypt = require("bcrypt");
const { envConfig } = require("../constants/config");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  let user = {
    email: req.body.email,
    username: req.body.username || "newUser",
    password: await bcrypt.hash(req.body.password, 10),
    role: 0,
    phone_number: req.body.phone_number || "",
    address: req.body.address || "Somewhere",
    avatar_url: req.fileID,
  };
  const refreshToken = await jwt.sign(
    {
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role,
      phone_number: user.phone_number,
      address: user.address,
      avatar_url: user.avatar_url,
    },
    envConfig.refreshTokenSecret
  );
  user.refresh_token = refreshToken;
  const data = await userServices.createUser(user);
  res.json({
    message: USER.CREATED,
    data,
  });
};

const loginUser = async (req, res) => {
  const data = await userServices.login(req.user);
  res.json({
    message: USER.LOGIN_SUCCESS,
    data,
  });
};

module.exports = {
  loginUser,
  registerUser,
};
