const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  updateProfile,
  createUser,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
  resetPasswordTokenToEmail,
  resetPasswordByToken,
} = require("../controllers/userController");

// Routes without authentication

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/password/reset").post(resetPasswordTokenToEmail);

router.route("/password/reset/:token").put(resetPasswordByToken);

// Authenticated Routes

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// Authorized Routes

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router
  .route("/admin/user")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
