const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { envConfig } = require("./constants/config");
const { connectDB } = require("./services/database.services");
const path = require("path");

// const userRoutes = require("./routes/user.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const foodRoutes = require("./routes/food.routes");
// const adminRoutes = require("./routes/admin.routes");
// const hostRoutes = require("./routes/host.routes");
// const addressRoutes = require("./routes/address.routes");
const defaultErrorHander = require("./middlewares/error.middlewares");

const port = envConfig.port;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
});

connectDB();

app.set("trust proxy", 1); // Trust first proxy
app.use(limiter);
app.use(morgan("combined"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use("/api/v1/user", userRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/food", foodRoutes);
// app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/host", hostRoutes);
// app.use("/api/v1/address", addressRoutes);
app.use(
  "/restaurantimage",
  express.static(path.join(__dirname, "/public/uploads/restaurants"))
);
app.use(defaultErrorHander);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// const generateData = require("./utils/generatedata");
// generateData();
module.exports = app;
