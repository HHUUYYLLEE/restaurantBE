const { USER } = require("../constants/message");
const userServices = require("../services/user.services");
const bcrypt = require("bcrypt");
const { envConfig } = require("../constants/config");
const jwt = require("jsonwebtoken");
const drive = require("../utils/googledrivecre");

const registerUser = async (req, res) => {
  let user = {
    email: req.body.email,
    username: req.body.username || "newUser",
    password: await bcrypt.hash(req.body.password, 10),
    role: 0,
    phone_number: req.body.phone_number || "",
    address: req.body.address || "Somewhere",
    avatar_url: req.fileURL,
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
  const userData = await userServices.createUser(user);
  const data = userData.toJSON();
  let responseData = await userServices.login(data);
  res.json({
    message: USER.CREATED,
    data: responseData,
  });
};

const loginUser = async (req, res) => {
  let data = await userServices.login(req.user);

  res.json({
    message: USER.LOGIN_SUCCESS,
    data,
  });
};

const loginUserGoogle = async (req, res) => {
  let data;
  const dbUser = await userServices.getUserFromEmail(
    req.userTicket.payload.email
  );
  if (dbUser) {
    data = await userServices.login(dbUser.toJSON());
    res.json({ message: USER.LOGIN_SUCCESS, data });
  } else {
    let user = {
      email: req.userTicket.payload.email,
      username: req.userTicket.payload.name,
      password: await bcrypt.hash(req.userTicket.payload.sub, 10),
      role: 0,
      phone_number: "",
      address: "Somewhere",
      avatar_url: req.userTicket.payload.picture,
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
    let userData = await userServices.createUser(user);
    const data = userData.toJSON();
    let responseData = await userServices.login(data);
    res.json({
      message: USER.CREATED,
      data,
    });
  }
};
const getUserProfile = async (req, res) => {
  delete req.user.password;
  res.json({ message: USER.GET_PROFILE, user: req.user });
};
const updateUserProfile = async (req, res) => {
  const data = {
    username: req.body.username || "newUser",
    phone_number: req.body.phone_number || "",
    address: req.body.address || "Somewhere",
  };
  const userData = await userServices.updateUser(req.user._id, data);
  let user = userData.toJSON();
  delete user.password;
  res.json({ message: USER.UPDATE_SUCCESS, user });
};

const updateUserAvatar = async (req, res) => {
  if (req.user.avatar_url.includes("drive.google.com/thumbnail"))
    await drive.files.delete({
      fileId: req.user.avatar_url.split("drive.google.com/thumbnail?id=")[1],
    });
  const data = {
    avatar_url: req.fileURL,
  };
  const userData = await userServices.updateUser(req.user._id, data);
  let user = userData.toJSON();
  delete user.password;
  res.json({ message: USER.UPDATE_SUCCESS, user });
};
module.exports = {
  loginUser,
  registerUser,
  loginUserGoogle,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
};
