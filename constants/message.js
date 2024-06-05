const MESSAGE = {
  VALIDATION_ERROR: "Validation error",
};
const RESTAURANT = {
  NOT_FOUND: "Restaurant not found",
  INVALID_REQUEST: "Invalid restaurant request",
  NOT_CREATED: "Restaurant not created",
  CREATED: "Restaurant successfully created",
  FOUND_ALL: "Get all restaurants successfully",
  FOUND: "Get restaurant successfully",
  IMAGES_UPLOAD_FAILED: "Upload images failed",
  INVALID_TIME: "Invalid time for open/close",
};

const FOOD = {
  NOT_FOUND: "Food not found",
  INVALID_REQUEST: "Invalid food request",
  NOT_CREATED: "Food not created",
  CREATED: "Food successfully created",
  FOUND: "Get all Food successfully",
  IMAGE_UPLOAD_FAILED: "Upload image failed",
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
  IMAGE_UPLOAD_FAILED: "Upload image failed",
  GET_PROFILE: "Get user profile successfully",
  UPDATE_SUCCESS: "Updated profile successfully",
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
module.exports = { MESSAGE, RESTAURANT, FOOD, USER, ORDER_FOOD };
