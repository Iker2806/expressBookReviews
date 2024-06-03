const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to simulate an asynchronous book fetch
const fetchBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulating a delay for async operation
  });
};

// Task 10: Get the list of books available in the shop
public_users.get('/', async function (req, res) {
  try {
    const books = await fetchBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const books = await fetchBooks();
    if (books.hasOwnProperty(isbn)) {
      res.status(200).json(books[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details" });
  }
});

// Task 12: Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const books = await fetchBooks();
    const matchingBooks = Object.values(books).filter(book => book.author === author);

    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found for the author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13: Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const books = await fetchBooks();
    const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found for the title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const books = await fetchBooks();
    if (books.hasOwnProperty(isbn)) {
      const reviews = books[isbn].reviews;
      res.status(200).json(reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book reviews" });
  }
});

module.exports.general = public_users;
