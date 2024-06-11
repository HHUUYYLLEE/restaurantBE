const MESSAGE = {
  VALIDATION_ERROR: "Validation error",
};
const RESTAURANT = {
  NOT_FOUND: "Restaurant not found",
  INVALID_REQUEST: "Invalid restaurant request",
  UPDATE_FAILED: "restaurant updating failed",
  NOT_CREATED: "Restaurant not created",
  CREATED: "Restaurant successfully created",
  FOUND_ALL: "Get all restaurants successfully",
  FOUND: "Get restaurant successfully",
  IMAGES_UPLOAD_FAILED: "Upload images failed",
  INVALID_TIME: "Invalid time for open/close",
};

const FOOD = {
  NOT_FOUND: "Food not found",
  UPDATE_FAILED: "food updating failed",
  INVALID_REQUEST: "Invalid food request",
  NOT_CREATED: "Food not created",
  CREATED: "Food successfully created",
  FOUND: "Get all Food successfully",
  UPDATE_FAILED: "review updating failed0",
  IMAGES_UPLOAD_FAILED: "Upload image failed",
};
const USER = {
  GOOGLE_CREDENTIAL_INVALID: "Invalid google credential",
  CREATED: "User successfully created",
  INVALID_REQUEST: "Invalid user request",
  NOT_FOUND: "User not found",
  WRONG_PASSWORD: "Wrong pasword",
  INVALID_ROLE: "Invalid role",
  INVALID_PHONE_NUMBER: "Invalid phone number",
  INVALID_TOKEN: "Invalid token",
  EMAIL_EXIST: "Email existed",
  LOGIN_SUCCESS: "Login success",
  LOGIN_REQUIRED: "Login required",
  IMAGES_UPLOAD_FAILED: "Upload image failed",
  GET_PROFILE: "Get user profile successfully",
  UPDATE_SUCCESS: "Updated profile successfully",
  LOCKED: "Account locked",
};
const ORDER_FOOD = {
  CREATE_SUCCESS: "Created order successfully",
  UPDATE_SUCCESS: "Updated order successfully",
  NOT_FOUND: "Order not found",
  NOT_CREATED: "Order not created",
  DELETE_SUCCESS: "Removed order successfully",
  INVALID_REQUEST: "Invalid order request",
  FOUND: "Get order successfully",
  PLACE_SUCCESS: "Placed order successfully",
};
const REVIEW = {
  CREATE_SUCCESS: "Created review successfully",
  UPDATE_SUCCESS: "Updated review successfully",
  UPDATE_FAILED: "review updating failed",
  NOT_FOUND: "review not found",
  NOT_CREATED: "review not created",
  DELETE_SUCCESS: "Removed review successfully",
  DELETE_FAILED: "Removed review failed",
  INVALID_REQUEST: "Invalid review request",
  FOUND: "Get review successfully",
  IMAGES_UPLOAD_FAILED: "Uploading images failed",
  REPORT_SUCCESS: "Reporting review successfully",
  REPORT_FAILED: "Reporting review failed",
  LIKE_DISLIKE_SUCCESS: "like/dislike successfully",
  LIKE_DISLIKE_FAILED: "like/dislike failed",
};
module.exports = { MESSAGE, RESTAURANT, FOOD, USER, ORDER_FOOD, REVIEW };
