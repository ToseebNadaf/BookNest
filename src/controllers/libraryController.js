const { prisma } = require("../config/db");
const translate = require("../utils/translate");

// Get all libraries
const getAllLibraries = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";

    const libraries = await prisma.library.findMany({
      include: {
        books: {
          include: {
            borrower: true, // Include borrower details for each book
          },
        },
      },
    });

    res.status(200).json({ success: true, data: libraries });
  } catch (err) {
    next(err);
  }
};

// Get a specific library by ID
const getLibraryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = req.headers["accept-language"] || "en";

    const library = await prisma.library.findUnique({
      where: { id: parseInt(id) },
      include: {
        books: {
          include: {
            borrower: true, // Include borrower details for each book
          },
        },
      },
    });

    if (!library) {
      return res.status(404).json({
        success: false,
        message: translate("LIBRARY_NOT_FOUND", lang),
      });
    }

    res.status(200).json({ success: true, data: library });
  } catch (err) {
    next(err);
  }
};

// Create a new library
const createLibrary = async (req, res, next) => {
  try {
    const { name, location } = req.body;
    const lang = req.headers["accept-language"] || "en";

    const newLibrary = await prisma.library.create({
      data: {
        name,
        location,
      },
    });

    res.status(201).json({
      success: true,
      message: translate("LIBRARY_CREATED_SUCCESS", lang),
      data: newLibrary,
    });
  } catch (err) {
    next(err);
  }
};

// Update a library by ID
const updateLibrary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const lang = req.headers["accept-language"] || "en";

    const updatedLibrary = await prisma.library.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
      },
    });

    res.status(200).json({
      success: true,
      message: translate("LIBRARY_UPDATED_SUCCESS", lang),
      data: updatedLibrary,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a library by ID
const deleteLibrary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = req.headers["accept-language"] || "en";

    await prisma.library.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: translate("LIBRARY_DELETED_SUCCESS", lang),
    });
  } catch (err) {
    next(err);
  }
};

// Get library inventory (books in the library)
const getLibraryInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = req.headers["accept-language"] || "en";

    const library = await prisma.library.findUnique({
      where: { id: parseInt(id) },
      include: {
        books: {
          include: {
            borrower: true, // Include borrower details for each book
          },
        },
      },
    });

    if (!library) {
      return res.status(404).json({
        success: false,
        message: translate("LIBRARY_NOT_FOUND", lang),
      });
    }

    res.status(200).json({ success: true, data: library.books });
  } catch (err) {
    next(err);
  }
};

// Add a book to the library inventory
const addBookToInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bookId } = req.body;
    const lang = req.headers["accept-language"] || "en";

    // Check if the library exists
    const library = await prisma.library.findUnique({
      where: { id: parseInt(id) },
    });
    if (!library) {
      return res.status(404).json({
        success: false,
        message: translate("LIBRARY_NOT_FOUND", lang),
      });
    }

    // Check if the book exists
    const book = await prisma.book.findUnique({
      where: { id: parseInt(bookId) },
    });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: translate("BOOK_NOT_FOUND", lang),
      });
    }

    // Update the book's libraryId to add it to the library's inventory
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(bookId) },
      data: {
        libraryId: parseInt(id),
      },
    });

    res.status(200).json({
      success: true,
      message: translate("BOOK_ADDED_TO_INVENTORY_SUCCESS", lang),
      data: updatedBook,
    });
  } catch (err) {
    next(err);
  }
};

// Remove a book from the library inventory
const removeBookFromInventory = async (req, res, next) => {
  try {
    const { id, bookId } = req.params;
    const lang = req.headers["accept-language"] || "en";

    // Check if the library exists
    const library = await prisma.library.findUnique({
      where: { id: parseInt(id) },
    });
    if (!library) {
      return res.status(404).json({
        success: false,
        message: translate("LIBRARY_NOT_FOUND", lang),
      });
    }

    // Check if the book exists
    const book = await prisma.book.findUnique({
      where: { id: parseInt(bookId) },
    });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: translate("BOOK_NOT_FOUND", lang),
      });
    }

    // Remove the book from the library by setting libraryId to null
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(bookId) },
      data: {
        libraryId: null,
      },
    });

    res.status(200).json({
      success: true,
      message: translate("BOOK_REMOVED_FROM_INVENTORY_SUCCESS", lang),
      data: updatedBook,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  getLibraryInventory,
  addBookToInventory,
  removeBookFromInventory,
};
