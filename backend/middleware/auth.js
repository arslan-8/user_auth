const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const ErrorHandler = require("../utils/errorHandler");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    const decodedData = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await db.getUserByEmail(decodedData.user.email);

    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
