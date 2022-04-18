const express = require("express");

const router = express.Router();

const { check, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

require("dotenv").config();

let User = require("../models/User");

//Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route post api/user

//desc insert User

//access public

router.post(
  "/",

  [
    check("name", "Name is required")
      .not()

      .isEmpty(),

    check("email", "Please enter valid email").isEmail(),

    check("password", "please enter password with 3 or more").isLength({
      min: 3,
    }),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      //check if user email is already in the database

      let user1 = await User.findOne({ email: req.body.email });

      if (user1) {
        return res.status(400).json({ error: [{ msg: "user already exits" }] });
      }

      //hash the password

      hashedPassword = await bcrypt.hash(req.body.password, 12);

      //create a user

      const newUser = new User({
        name: req.body.name,

        email: req.body.email,

        password: hashedPassword,

        role: req.body.role,
      });

      //save the user

      await newUser.save();

      //generate token

      const payload = {
        user: {
          id: newUser.id,

          name: newUser.name,
          role: newUser.role,
        },
      };

      jwt.sign(
        payload,

        process.env.JWT_SECRET,

        { expiresIn: 360000 },

        (err, token) => {
          if (err) throw err;

          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

//Make admin
router.put("/", async (req, res) => {
  try {
    const user = await User.updateOne(
      { _id: req.body._id },
      { $set: { role: ["Admin"] } }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
