const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db.js");
const translate = require("../utils/translate");

// Register a new user
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const lang = req.headers["accept-language"] || "en";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: translate("USER_ALREADY_EXISTS", lang),
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "borrower", // Default role is "borrower"
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      message: translate("USER_REGISTERED_SUCCESS", lang),
      data: { user: newUser, token },
    });
  } catch (err) {
    next(err);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const lang = req.headers["accept-language"] || "en";

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: translate("USER_NOT_FOUND", lang),
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: translate("INVALID_CREDENTIALS", lang),
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: translate("LOGIN_SUCCESS", lang),
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser };
