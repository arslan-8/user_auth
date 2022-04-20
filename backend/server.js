const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');

// Config
dotenv.config({path:'backend/config/config.env'});

// middleware
app.use(express.json());
//app.use(cookieParser());
//app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3001',
//   credentials: true
// }));

// Route imports
const apiRouter = require("./routes/apiRoute");
apiRouter.use(cookieParser());
app.use("/apiRouter", apiRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is listening  on http://localhost:${PORT}`);
});

module.exports = app;
