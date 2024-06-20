const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { envConfig } = require("./constants/config");
const { connectDB } = require("./services/database.services");
const path = require("path");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const reviewRoutes = require("./routes/review.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const foodRoutes = require("./routes/food.routes");
const orderFoodRoutes = require("./routes/order_food.routes");
const defaultErrorHander = require("./middlewares/error.middlewares");
const orderTableRoutes = require("./routes/order_table.routes");

const port = envConfig.port;
const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
});

connectDB();

app.set("trust proxy", 1); // Trust first proxy
// app.use(limiter);
app.use(morgan("combined"));
app.use(helmet());
app.use(cors({ origin: [envConfig.frontendVercel] }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/order_food", orderFoodRoutes);
app.use("/api/order_table", orderTableRoutes);
app.use("/api/review", reviewRoutes);

app.use(defaultErrorHander);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// const generateData = require("./utils/generatedata");
// generateData();
