const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "admin", password: "password" }
];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });

  req.session.authorization = {
    accessToken: token,
    username: username
  };

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!isbn || !review) {
      return res.status(400).json({ message: "ISBN and review are required" });
    }

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated.` });
  } catch (error) {
    console.error("Error processing the review:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!isbn) {
      return res.status(400).json({ message: "ISBN is required" });
    }

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for the user" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been deleted.` });
  } catch (error) {
    console.error("Error deleting the review:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
