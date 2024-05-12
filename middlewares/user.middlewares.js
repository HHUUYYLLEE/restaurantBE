const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const { USER } = require("../constants/message");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ErrorWithStatus } = require("../utils/errors");
const STATUS = require("../constants/status");
const { envConfig } = require("../constants/config");
const userServices = require("../services/user.services");
const drive = require("../utils/googledrivecre");
const stream = require("stream");
const { OAuth2Client } = require("google-auth-library");
const googleDriveURL = require("../utils/googleDriveURL");

const userAvatarValidator = async (req, res, next) => {
  //   console.log(typeof req.file);
  if (req.file === undefined || req.file === null)
    next(new Error(USER.INVALID_REQUEST));
  if (req.file.fieldname !== "avatar") next(new Error(USER.INVALID_REQUEST));
  next();
};

const googleDriveUpload = async (req, res, next) => {
  const image = req.file;
  let bufferStream = new stream.PassThrough();
  bufferStream.end(image.buffer);
  try {
    let filename = Date.now() + Math.random() + "user";
    filename = filename.replace(/\./g, "");
    const metaData = {
      name: filename + ".jpg",
      parents: [envConfig.user_folder_id], // the ID of the folder you get from createFolder.js is used here
    };
    const media = {
      mimeType: "image/jpeg",
      body: bufferStream, // the image sent through multer will be uploaded to Drive
    };

    // uploading the file
    const uploadFile = await drive.files.create({
      resource: metaData,
      media: media,
      fields: "id",
    });

    req.fileURL = googleDriveURL(uploadFile.data.id);
  } catch (err) {
    next(new Error(USER.IMAGE_UPLOAD_FAILED));
  }

  next();
};

const loginValidator = async (req, res, next) => {
  let dbUser = await userServices.getUserFromEmail(req.body.email);
  if (!dbUser) next(new Error(USER.NOT_FOUND));
  let tempUser = dbUser.toJSON();
  let verify = await bcrypt.compare(req.body.password, tempUser.password);
  if (!verify) next(new Error(USER.WRONG_PASSWORD));
  req.user = tempUser;
  next();
};

const registerValidator = validate(
  checkSchema({
    email: {
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value) => {
          let dbUser = await userServices.getUserFromEmail(value);
          if (dbUser) throw new Error(USER.EMAIL_EXIST);
          return true;
        },
      },
    },
    password: {
      notEmpty: true,
      trim: true,
    },
    phone_number: { trim: true },
    address: { trim: true },
    username: { trim: true },
  }),
  ["body"]
);

const validateAccessToken = async (req, res, next) => {
  req.needToVerifyRefreshToken = false;
  req.temporaryToken = null;
  let authHeader =
    req.headers.Authorization || req.headers.authorization || null;
  // console.log(authHeader);
  if (authHeader && authHeader.startsWith("Bearer")) {
    req.temporaryToken = authHeader.split(" ")[1];
    if (req.temporaryToken === undefined || req.temporaryToken === null) {
      throw new ErrorWithStatus({
        message: USER.LOGIN_REQUIRED,
        status: STATUS.UNAUTHORIZED,
      });
    }
    jwt.verify(
      req.temporaryToken,
      envConfig.accessTokenSecret,
      (err, decoded) => {
        if (err) {
          req.needToVerifyRefreshToken = true;
          next();
        }
        req.user = decoded;
        next();
      }
    );
  } else {
    throw new ErrorWithStatus({
      message: USER.LOGIN_REQUIRED,
      status: STATUS.UNAUTHORIZED,
    });
  }
};
const validateRefreshToken = async (req, res, next) => {
  if (req.needToVerifyRefreshToken === false) next();
  const user = await userServices.findRefreshToken(req.temporaryToken);
  if (!user)
    throw new ErrorWithStatus({
      message: USER.LOGIN_REQUIRED,
      status: STATUS.UNAUTHORIZED,
    });
  req.user = user;
  next();
};

const verifyGoogleLoginCredentials = async (req, res, next) => {
  try {
    const client = new OAuth2Client(envConfig.clientID);

    req.userTicket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: envConfig.clientID,
    });
    // console.log(req.userTicket);

    next();
  } catch (error) {
    next(new Error(USER.GOOGLE_CREDENTIAL_INVALID));
  }
};

module.exports = {
  loginValidator,
  userAvatarValidator,
  registerValidator,
  validateAccessToken,
  validateRefreshToken,
  googleDriveUpload,
  verifyGoogleLoginCredentials,
};
