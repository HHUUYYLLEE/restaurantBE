const express = require("express");
const {
  loginValidator,
  registerValidator,
  googleDriveUpload,
  userAvatarValidator,
  verifyGoogleLoginCredentials,
  validateAccessToken,
  validateRefreshToken,
  validateUserIDProfile,
  validateUpdateUserProfile,
} = require("../middlewares/user.middlewares");
const {
  loginUser,
  registerUser,
  loginUserGoogle,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/user.controllers");
const wrapRequestHandler = require("../utils/handlers");
const upload = require("../utils/multer");

const router = express.Router();
router.get(
  "/profile/:id",
  validateAccessToken,
  validateRefreshToken,
  validateUserIDProfile,
  wrapRequestHandler(getUserProfile)
);
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
router.put(
  "/updateProfile",
  validateUpdateUserProfile,
  validateAccessToken,
  validateRefreshToken,
  wrapRequestHandler(updateUserProfile)
);
router.put(
  "/updateAvatar",
  upload.single("avatar"),
  userAvatarValidator,
  validateAccessToken,
  validateRefreshToken,
  googleDriveUpload,
  wrapRequestHandler(updateUserAvatar)
);
module.exports = router;
