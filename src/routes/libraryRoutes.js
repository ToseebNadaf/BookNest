const express = require("express");
const { validateToken } = require("../middleware/authMiddleware");
const {
  getAllLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  getLibraryInventory,
  addBookToInventory,
  removeBookFromInventory,
} = require("../controllers/libraryController");

const router = express.Router();

// GET /api/libraries - Retrieve all libraries (existing code)
router.get("/", validateToken, getAllLibraries);

// GET /api/libraries/:id - Retrieve a specific library by ID (existing code)
router.get("/:id", validateToken, getLibraryById);

// POST /api/libraries - Create a new library (existing code)
router.post("/", validateToken, createLibrary);

// PUT /api/libraries/:id - Update a library by ID (existing code)
router.put("/:id", validateToken, updateLibrary);

// DELETE /api/libraries/:id - Delete a library by ID (existing code)
router.delete("/:id", validateToken, deleteLibrary);

// GET /api/libraries/:id/inventory - Retrieve a list of books in the library
router.get("/:id/inventory", validateToken, getLibraryInventory);

// POST /api/libraries/:id/inventory - Add a book to the library inventory
router.post("/:id/inventory", validateToken, addBookToInventory);

// DELETE /api/libraries/:id/inventory/:bookId - Remove a book from the library inventory
router.delete("/:id/inventory/:bookId", validateToken, removeBookFromInventory);

module.exports = router;
