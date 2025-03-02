const Joi = require("joi");

// Validation schema for creating a book
const createBookSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  authorId: Joi.number().integer().required().messages({
    "number.base": "Author ID must be a number",
    "any.required": "Author ID is required",
  }),
  libraryId: Joi.number().integer().required().messages({
    "number.base": "Library ID must be a number",
    "any.required": "Library ID is required",
  }),
});

// Validation schema for updating a book
const updateBookSchema = Joi.object({
  title: Joi.string().optional().messages({
    "string.empty": "Title cannot be empty",
  }),
  description: Joi.string().optional().messages({
    "string.empty": "Description cannot be empty",
  }),
  authorId: Joi.number().integer().optional().messages({
    "number.base": "Author ID must be a number",
  }),
  libraryId: Joi.number().integer().optional().messages({
    "number.base": "Library ID must be a number",
  }),
  borrowerId: Joi.number().integer().optional().messages({
    "number.base": "Borrower ID must be a number",
  }),
});

module.exports = { createBookSchema, updateBookSchema };
