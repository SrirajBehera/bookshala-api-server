const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Seller = mongoose.model("Seller");
const requireLogin = require("../middlewares/requireLogin");

router.get("/", (req, res) => {
  res.send("HELLO bookshala server!");
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello User");
});

// exclusive for web Client
router.post("/register", (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    // code 422 - server has understood the request but couldn't process the same
    return res.status(422).json({ error: "Please add all the fields" });
  }
  // res.json({ message: "Successfully Posted" });

  Seller.findOne({ email: email })
    .then((savedSeller) => {
      if (savedSeller) {
        return res
          .status(422)
          .json({ error: "Admin with that email already exists. Please Sign in." });
      }

      bcrypt.hash(password, 16)
        .then((hashedPassword) => {
          const seller = new Seller({
            name: name, // if key and value are both same then we can condense it to just name, email, etc.
            email: email,
            password: hashedPassword
          });

          seller
            .save()
            .then((seller) => {
              res.status(200).json({ message: "User Created Successfully!", data: seller });
            })
            .catch((err) => {
              console.log(`Error saving user - ${err}`);
            });
        })
    })
    .catch((err) => {
      console.log(`Error in email findOne - ${err}`);
    });
});

// exclusive for web Client
router.post("/login", (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "Please enter email or password" });
  }

  Seller.findOne({ email: email }).then((savedSeller) => {
    if (!savedSeller) {
      return res.status(422).json({ error: "Invalid email or password 1" });
    }
    bcrypt
      .compare(password, savedSeller.password)
      .then((doMatch) => {
        // doMatch is a boolean value
        if (doMatch) {
          // res.json({ message: "Successfully Signed In" });
          const { _id, name, email } = savedSeller;
          const token = jwt.sign({ _id: savedSeller._id }, process.env.JWT_SECRET);
          res.json({ token: token, seller: { _id, name, email } });
        } else {
          return res.status(422).json({ error: "Invalid email or password 2" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
