const express = require("express");
let blogs = require("../models/blog");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const authMiddlewareIsAdmin = require("../middlewares/authMiddlewareIsAdmin");

const router = express.Router();

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
