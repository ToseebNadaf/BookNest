const { prisma } = require("../config/db");
const { upload } = require("../middleware/uploadMiddleware");
const cloudinary = require("../utils/cloudinary");
const translate = require("../utils/translate");

// Get all books
const getAllBooks = async (req, res, next) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: true, // Include author details
        library: true, // Include library details
        borrower: true, // Include borrower details
      },
    });
    res.status(200).json({ success: true, data: books });
  } catch (err) {
    next(err);
  }
};

// Get a specific book by ID
const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = req.headers["accept-language"] || "en";

    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true,
        library: true,
        borrower: true,
      },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: translate("BOOK_NOT_FOUND", lang),
      });
    }

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { title, description, image, authorId, libraryId } = req.body;
    const lang = req.headers["accept-language"] || "en";
    const imageUrl = req.file ? req.file.path : null;

    // Convert IDs to integers
    const parsedAuthorId = parseInt(authorId);
    const parsedLibraryId = parseInt(libraryId);

    // Check if the Library exists
    const libraryExists = await prisma.library.findUnique({
      where: { id: parsedLibraryId },
    });

    if (!libraryExists) {
      return res.status(400).json({
        success: false,
        message: translate("LIBRARY_NOT_FOUND_DETAILS", lang),
      });
    }

    // Check if the Author exists
    const authorExists = await prisma.user.findUnique({
      where: { id: parsedAuthorId },
    });

    if (!authorExists) {
      return res.status(400).json({
        success: false,
        message: translate("AUTHOR_NOT_FOUND_DETAILS", lang),
      });
    }

    // Create the book after validation
    const newBook = await prisma.book.create({
      data: {
        title,
        description,
        image: imageUrl,
        authorId: parsedAuthorId,
        libraryId: parsedLibraryId,
      },
    });

    res.status(201).json({
      success: true,
      message: translate("BOOK_CREATED_SUCCESS", lang),
      data: newBook,
    });
  } catch (err) {
    next(err);
  }
};

// Update a book by ID
const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, image, authorId, libraryId, borrowerId } =
      req.body;
    const lang = req.headers["accept-language"] || "en";
    const imageUrl = req.file ? req.file.path : null;

    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        image: imageUrl,
        authorId: parseInt(authorId),
        libraryId: parseInt(libraryId),
        borrowerId: borrowerId ? parseInt(borrowerId) : null,
      },
    });

    res.status(200).json({
      success: true,
      message: translate("BOOK_UPDATED_SUCCESS", lang),
      data: updatedBook,
    });
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = req.headers["accept-language"] || "en";

    // Find the book to get the image URL
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: translate("BOOK_NOT_FOUND", lang),
      });
    }

    // Delete the image from Cloudinary (if it exists)
    if (book.image) {
      const publicId = book.image.split("/").pop().split(".")[0]; // Extract public ID
      await cloudinary.uploader.destroy(`book-covers/${publicId}`);
    }

    // Delete the book from the database
    await prisma.book.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: translate("BOOK_DELETED_SUCCESS", lang),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook: [upload.single("image"), createBook],
  updateBook: [upload.single("image"), updateBook],
  deleteBook,
};
