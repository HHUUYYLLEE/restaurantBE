const express = require("express");
const router = express.Router();
const { getEnv } = require("../controllers/utils.controllers");
const wrapRequestHandler = require("../utils/handlers");
router.get("/env", wrapRequestHandler(getEnv));
module.exports = router;
