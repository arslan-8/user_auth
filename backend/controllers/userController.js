const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const randtoken = require("rand-token");

const sendToken = require("../utils/jwtToken");
const db = require("../config/db");
const ErrorHandler = require("../utils/errorHandler");

const sendEmail = require("../utils/sendEmail");

// Register user
exports.registerUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      return next(
        new ErrorHandler("Please provide all the required fields", 400)
      );
    }

    if (password !== confirmPassword) {
      return next(new ErrorHandler("Password does not match", 400));
    }

    const getUser = await db.getUserByEmail(email);

    if (getUser != null && getUser.email == email) {
      return next(new ErrorHandler("User already exists with this email address", 400));
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await db.insertUser(name, email, password);

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
    const user = await db.getUserByEmail(email);

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isValidPassword = compareSync(password, user.password);
    if (isValidPassword) {
      user.password = undefined;

      sendToken(user, 201, res);
    } else {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
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
exports.resetPasswordTokenToEmail = async (req, res, next) => {
  var email = req.body.email;

  const user = await db.getUserByEmail(email);

  if (user) {
    var resetToken = randtoken.generate(20);

    // const resetPasswordUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/password/reset/${resetToken}`;

    const resetPasswordUrl = `http://localhost:3000/password/reset/${resetToken}`;

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

    const date = new Date(Date.now());

    date.setMinutes(date.getMinutes() + 30);

    let data = {
      token: resetToken,
      token_expire: date,
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
exports.resetPasswordByToken = async (req, res, next) => {
  const token = req.params.token;
  let password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!token || !password || !confirmPassword) {
    return next(
      new ErrorHandler("Please provide all the required fields", 400)
    );
  }

  const user = await db.getUserByToken(token);

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  const token_date = new Date(user.token_expire);

  const now = new Date(Date.now());

  const isExpired = token_date <= now;

  if (isExpired) {
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
    token: null,
    token_expire: null,
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
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;

    const userId = req.user.id;

    if (!name || !email || !password || !userId) {
      return res.sendStatus(400);
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await db.updateUser(name, email, password, userId);
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
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      return next(
        new ErrorHandler("Please provide all the required fields", 400)
      );
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

    const user = await db.insertUser(name, email, password);
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
    const name = req.body.name;
    const role = req.body.role;
    const email = req.body.email;
    const userId = req.params.id;

    if (!name || !role || !email) {
      return res.sendStatus(400);
    }

    const isUser = await db.getUserById(userId);

    if (!isUser) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
      );
    }

    const user = await db.updateUser(name, role, email, userId);
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

    const user = await db.getUserById(userId);

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
      );
    }

    await db.deleteUser(userId);

    res.status(204).json({
      success: true,
      message: "User deleted successfully",
    });
  
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
