const jsonwebtoken = require("jsonwebtoken");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const randtoken = require("rand-token");

const sendToken = require("../utils/jwtToken");
const db = require("../config/db");
const ErrorHandler = require("../utils/errorHandler");

const sendEmail = require("../utils/sendEmail");
const { getUserByToken } = require("../config/db");

// Register user
exports.registerUser = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const email = req.body.email;
    let password = req.body.password;
    const confirmPassword = req.body.password;

    if (!userName || !email || !password || confirmPassword) {
      return res.sendStatus(400);
    }

    if (password !== confirmPassword) {
      return next(new ErrorHandler("Password does not match", 400));
    }

    const getUser = await db.getUserByEmail(email);

    if (getUser != null && getUser.email == email) {
      return res.json({
        message: "User already exists with this email address",
      });
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await db.insertUser(userName, email, password);

    sendToken(user, 201, res);

    //return res.redirect('/mainpage');
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

// Login user
exports.loginUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    user = await db.getUserByEmail(email);

    if (!user) {
      return res.json({
        message: "Invalid email or password",
      });
    }

    const isValidPassword = compareSync(password, user.password);
    if (isValidPassword) {
      user.password = undefined;

      sendToken(user, 201, res);
    } else {
      return res.json({
        message: "Invalid email or password",
      });
    }
  } catch (e) {
    console.log(e);
  }
};

// logout user
exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

// Generate and send reset password token to email
exports.resetPasswordTokenEmail = async (req, res, next) => {
  var email = req.body.email;

  const user = await db.getUserByEmail(email);

  if (user.email.length > 0) {
    var resetToken = randtoken.generate(20);

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it `;

    try {
      await sendEmail({
        email: user.email,
        subject: `User Auth Password Recovery`,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    let data = {
      token: resetToken,
    };

    await db.updateUserTokenOrPassword(email, data);

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "The email is not registered with us",
    });
  }
};

// update password to database
exports.resetPassword = async (req, res, next) => {
  const token = req.body.token;
  let password = req.body.password;
  const confirmPassword = req.body.password;

  if (!token || !password) {
    return res.sendStatus(400);
  }

  const user = await getUserByToken(token);

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  const salt = genSaltSync(10);
  password = hashSync(password, salt);

  let data = {
    password,
  };

  const user2 = await db.updateUserTokenOrPassword(user.email, data);

  sendToken(user2, 200, res);
};

// Get User Details
exports.getUserDetails = async (req, res, next) => {
  const user = await db.getUserByEmail(req.user.email);

  res.status(200).json({
    success: true,
    user,
  });
};

// Update a user
exports.updateProfile = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const email = req.body.email;
    let password = req.body.password;

    const role = req.user.role;
    const userId = req.user.id;

    if (!userName || !role || !email || !password || !userId) {
      return res.sendStatus(400);
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await db.updateUser(userName, role, email, password, userId);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
    });
  }
};

// Create a user -- Admin
exports.createUser = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const email = req.body.email;
    let password = req.body.password;

    if (!userName || !email || !password) {
      return res.sendStatus(400);
    }

    const getUser = await db.getUserByEmail(email);

    if (getUser != null && getUser.email == email) {
      return res.json({
        message: "User already exists with this email address",
      });
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await db.insertUser(userName, email, password);
    res.status(200).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
    });
  }
};

// Get all users -- Admin
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await db.allUser();
    res.json({ users: users });
  } catch (e) {
    console.log(e);
  }
};

// Get user detail --- Admin
exports.getSingleUser = async (req, res, next) => {
  const user = await db.getUserById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
};

// Update user role/detail -- Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const role = req.body.role;
    const email = req.body.email;
    let password = req.body.password;
    const userId = req.params.id;

    if (!userName || !role || !email || !password) {
      return res.sendStatus(400);
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await db.updateUser(userName, role, email, password, userId);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await db.deleteUser(userId);

    return res.status(204).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};