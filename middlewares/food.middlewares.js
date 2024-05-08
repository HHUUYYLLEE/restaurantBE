const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const { FOOD } = require("../constants/message");

const createFoodValidator = validate(checkSchema({}), ["body"]);
const allFoodValidator = validate(checkSchema({}), ["query"]);
const allFoodInRestaurantValidator = validate(checkSchema({}), ["query"]);
