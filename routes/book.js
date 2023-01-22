const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Book = mongoose.model("Book");
const requireLogin = require("../middlewares/requireLogin");

router.get("/getBooks", requireLogin, (req, res) => {
  console.log("/getBooks: ", req.body);
  Book.find({ seller: req.seller._id })
    .populate("seller", "_id name")
    .then(result => {
      console.log("/getBooks result: ", result);
      res.status(200).json({ allBooks_data: result });
    })
    .catch(err => {
      console.error("/getBooks fetch error: ", err);
    })
});

router.get("/getBooks/:bookid", requireLogin, (req, res) => {
  console.log("/getBook: ", req.body);
  Book.findById(req.params.bookid)
    .then(result => {
      console.log("/getBook result: ", result);
      res.status(200).json({ allBooks_data: result });
    })
    .catch(err => {
      console.error("/getBook fetch api error: ", err);
    })
});

router.post("/addBook", requireLogin, (req, res) => {
  console.log("/addBook: ", req.body);

  const { name, author, edition, publication_year, quantity, price } = req.body;
  if (!name || !author || !edition || !publication_year || !quantity || !price) {
    return res.status(422).json({ addbook_data: "Please fill all the details required" })
  }

  const book = new Book({
    name: name,
    author: author,
    edition: edition,
    publication_year: publication_year,
    quantity: quantity,
    price: price,
    seller: req.seller
  })

  book.save()
    .then(book => {
      console.log("addBook result: " + book)
      res.status(200).json({ addbook_data: book })
    })
    .catch(err => {
      console.error("addBook api error: " + err)
    })
})

router.put("/editBook/:bookid", requireLogin, (req, res) => {
  console.log("editBook: " + req.body);
  const { name, author, edition, publication_year, quantity, price } = req.body;

  Book.findByIdAndUpdate(req.params.bookid, {
    name: name,
    author: author,
    edition: edition,
    publication_year: publication_year,
    quantity: quantity,
    price: price
  }, {
    new: true
  })
    .exec((err, book) => {
      if (err) {
        return res.status(422).json({ editBook_data: err })
      }
      res.status(200).json({ editBook_data: book })
    })
})

router.delete("/deleteBook/:bookid", requireLogin, (req, res) => {
  console.log("/deleteBook: ", req.body);

  Book.findByIdAndRemove(req.params.bookid)
    .then(book => {
      if (!book) {
        res.status(404).json({ deleteBook_data: "Book not found" });
      }
      res.status(200).json({ deleteBook_data: book })
    })
    .catch(err => {
      console.error("deleteBook api error: " + err);
    })
})

module.exports = router;
