const mongoose = require("mongoose");
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: { type: String, maxlength: 160, required: true },
    password: { type: String, maxlength: 160, required: true },
    role: { type: Number, required: true },
    phone_number: { type: String, maxlength: 20, required: false },
    address: { type: String, maxlength: 250, required: false },
    avatar_url: { type: String, maxlength: 160, required: false },
  },
  {
    timestamps: true,
    collection: "user",
  }
);

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if the entered password is correct
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );
};

// Method to generate a refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "15d",
    }
  );
};

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
