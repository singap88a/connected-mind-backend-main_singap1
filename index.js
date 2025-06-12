require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const connectDB = require("./config/db");
const port = process.env.PORT || 3000;

connectDB(process.env.MONGO_DB);

const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const courseRoute = require("./routes/course-route");

const app = express();

app.use(helmet());
app.use(xss());
app.set("trust proxy", 1);

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    message: "Too many requests from this IP",
  },
});

app.use(limiter);

const corsOptions = {
  origin: [
    "http://127.0.0.1:5500",
    "https://mo-waleed.github.io",
    "https://connected-mind.vercel.app",
    'https://connected-mind-henna.vercel.app/',
    'https://elegant-sunflower-d4af07.netlify.app/',
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // إذا كنت تستخدم cookies أو tokens
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Welcome to the API!" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/courses", courseRoute);

app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: "Resource not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Error details:", err);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
