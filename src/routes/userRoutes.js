const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const validate = require("../middleware/validate");
const {
  registerUserSchema,
  loginUserSchema,
} = require("../validations/userValidations");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// POST /api/users/register - Register a new user (with validation and rate limiting)
router.post(
  "/register",
  authLimiter,
  validate(registerUserSchema),
  registerUser
);

// POST /api/users/login - Login user (with validation and rate limiting)
router.post("/login", validate(loginUserSchema), loginUser);

module.exports = router;
