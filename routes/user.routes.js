const express = require("express");
const {
  loginValidator,
  registerValidator,
  googleDriveUpload,
  userAvatarValidator,
  verifyGoogleLoginCredentials,
} = require("../middlewares/user.middlewares");
const {
  loginUser,
  registerUser,
  loginUserGoogle,
} = require("../controllers/user.controllers");
const wrapRequestHandler = require("../utils/handlers");
const upload = require("../utils/multer");

const router = express.Router();
router.post(
  "/register",
  upload.single("avatar"),
  userAvatarValidator,
  registerValidator,
  googleDriveUpload,
  wrapRequestHandler(registerUser)
);

router.post(
  "/loginGoogle",
  verifyGoogleLoginCredentials,
  wrapRequestHandler(loginUserGoogle)
);
router.post("/login", loginValidator, wrapRequestHandler(loginUser));
module.exports = router;
