const express = require("express");
let blogs = require("../models/blog");
let user = require("../models/user");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const authMiddlewareIsAdmin = require("../middlewares/authMiddlewareIsAdmin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await user.find();
    res.send(users);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

router.get("/isadmin", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userData = decoded.user;
    console.log(userData);
    if (userData.role[0] === "Admin") {
      return res.send("true");
    } else {
      return res.send("false");
    }
  } catch (err) {
    return res.send("false");
  }
});

//route Get api/blog
//desc Get all blogs
//access public
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const blogDB = await blogs.find();
//     res.send(blogDB);
//   } catch (err) {
//     return res.status(500).send("Server error");
//   }
// });
router.get("/", async (req, res) => {
  try {
    const blogDB = await blogs.find();
    // const username = await user.findById(blogDB.author);
    // blogDB.author = username.name;
    res.send(blogDB);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route Post api/blog
//desc Insert blog
//access public
router.post(
  "/",
  authMiddlewareIsAdmin,
  [
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is mandatory").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newBlog = await blogs.create({
        title: req.body.title,
        date: req.body.date,
        author: req.user.id,
        description: req.body.description,
        imgUrl: req.body.imgurl,
      });
      res.send(newBlog);
    } catch (err) {
      return res.status(500).send("Server error!" + err);
    }
  }
);

//route delete api/blog
//desc delete blog by title and author
//access public
router.delete(
  "/",
  authMiddlewareIsAdmin,
  [
    check("title", "Title is required").not().isEmpty(),
    check("author", "Author is mandatory").not().isEmpty(),
  ],
  async (req, res) => {
    //find the blog by title and author
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const blog = await blogs.findOneAndRemove({
        title: req.body.title,
        author: req.body.author,
      });
      if (!blog) {
        return res.status(404).send("blog not found");
      }

      res.send("blog deleted");
    } catch (err) {
      return res.status(500).send("Server error!" + err);
    }
  }
);

//route put api/blog
//desc update blog
//access public
router.put(
  "/",
  authMiddlewareIsAdmin,
  [
    check("title", "Title is required").not().isEmpty(),
    check("description", "description is mandatory").not().isEmpty(),
    check("date", "Date is mandatory").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const blog = await blogs.findById(req.body._id);
      if (!blog) {
        return res.status(404).send("blog not found");
      }

      blog.title = req.body.title;
      blog.description = req.body.description;
      blog.date = req.body.date;

      await blog.save();
      res.send(blog);
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
