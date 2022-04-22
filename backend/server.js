const dotenv = require("dotenv");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Config
dotenv.config({ path: "backend/config/config.env" });
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// apiRouter.use(cookieParser());
app.use(cookieParser());
// app.use(cors({
//   origin: 'http://localhost:3001',
//   credentials: true
// }));

// Route imports
const user = require("./routes/userRoute");
app.use("/api/v1", user);

// Middleware for Errors
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server is listening  on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
