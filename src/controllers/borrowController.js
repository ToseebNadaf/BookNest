const { prisma } = require("../config/db");
const translate = require("../utils/translate");

// Borrow a book
const borrowBook = async (req, res, next) => {
  try {
    const { bookId, userId, charge } = req.body;
    const lang = req.headers["accept-language"] || "en";

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

    // Check if the book is already borrowed
    if (book.borrowerId) {
      return res.status(400).json({
        success: false,
        message: translate("BOOK_ALREADY_BORROWED", lang),
      });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: translate("USER_NOT_FOUND", lang),
      });
    }

    // Update the book to mark it as borrowed
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(bookId) },
      data: {
        borrowerId: parseInt(userId),
      },
    });

    // Create a borrowing record (optional, for tracking purposes)
    const borrowingRecord = await prisma.borrowingRecord.create({
      data: {
        bookId: parseInt(bookId),
        userId: parseInt(userId),
        charge: parseFloat(charge),
        borrowedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: translate("BOOK_BORROWED_SUCCESS", lang),
      data: { book: updatedBook, borrowingRecord },
    });
  } catch (err) {
    next(err);
  }
};

// Return a borrowed book
const returnBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = req.headers["accept-language"] || "en";

    // Check if the book exists
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: translate("BOOK_NOT_FOUND", lang),
      });
    }

    // Check if the book is not borrowed
    if (!book.borrowerId) {
      return res.status(400).json({
        success: false,
        message: translate("BOOK_NOT_BORROWED", lang),
      });
    }

    // Update the book to mark it as returned
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { borrowerId: null },
    });

    // Update the borrowing record and return it
    await prisma.borrowingRecord.updateMany({
      where: {
        bookId: parseInt(id),
        returnedAt: null,
      },
      data: { returnedAt: new Date() },
    });

    // Fetch the updated borrowing record
    const borrowingRecord = await prisma.borrowingRecord.findFirst({
      where: { bookId: parseInt(id) },
      orderBy: { borrowedAt: "desc" }, // Get the latest borrowing record
    });

    res.status(200).json({
      success: true,
      message: translate("BOOK_RETURNED_SUCCESS", lang),
      data: { book: updatedBook, borrowingRecord },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { borrowBook, returnBook };
