// Create token and saving in cookie

const jsonwebtoken = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {

    const jsontoken = jsonwebtoken.sign(
        { user: user },
        process.env.SECRET_KEY,
        { expiresIn: "30m" }
      );

    // Option for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie('token', jsontoken, options).json({
        success: true,
        user,
        jsontoken,
    });
};

module.exports = sendToken;