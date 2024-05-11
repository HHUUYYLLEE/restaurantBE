const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: { type: String, maxlength: 160, required: false },
    password: { type: String, maxlength: 160, required: true },
    role: { type: Number, required: true },
    phone_number: { type: String, maxlength: 20, required: false },
    address: { type: String, maxlength: 250, required: false },
    avatar_url: { type: String, maxlength: 160, required: false },
    refresh_token: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "user",
  }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
