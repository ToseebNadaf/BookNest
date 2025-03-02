const express = require("express");
const { validateToken } = require("../middleware/authMiddleware");
const { borrowBook, returnBook } = require("../controllers/borrowController");

const router = express.Router();

// POST /api/borrow - Borrow a book
router.post("/borrow", validateToken, borrowBook);

// PUT /api/return/:id - Return a borrowed book
router.put("/return/:id", validateToken, returnBook);

module.exports = router;
