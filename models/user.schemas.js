const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
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

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
