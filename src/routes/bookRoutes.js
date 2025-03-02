const express = require("express");
const { validateToken } = require("../middleware/authMiddleware");
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const validate = require("../middleware/validate");
const { updateBookSchema, createBookSchema } = require("../validations/bookValidations");

const router = express.Router();

// GET /api/books - Retrieve all books
router.get("/", validateToken, getAllBooks);

// GET /api/books/:id - Retrieve a specific book by ID
router.get("/:id", validateToken, getBookById);

// POST /api/books - Create a new book (with validation)
router.post("/", validateToken, validate(createBookSchema), createBook);

// PUT /api/books/:id - Update a book by ID (with validation)
router.put("/:id", validateToken, validate(updateBookSchema), updateBook);

// DELETE /api/books/:id - Delete a book by ID
router.delete("/:id", validateToken, deleteBook);

module.exports = router;
