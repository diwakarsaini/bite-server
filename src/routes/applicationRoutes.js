const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
let Application = require("../models/Application");

const uuid = require("uuid");

const router = express.Router();

const { check, validationResult } = require("express-validator");

//route Get api/applications
//desc Get all applications
//access public
router.get("/", authMiddleware, async (req, res) => {
  try {
    //const todoDB = await Todo.find();
    const application = await Application.find({ user: req.user.id });
    res.send(application);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route Get api/applications/:id
//desc Get application by id
//access public
router.get("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).send("Application is not found");
    }
    res.send(application);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route Post api/applications
//desc Insert application
//access public
router.post("/", authMiddleware, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const file = req.files.myFile;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    const path2 = "public/uploads/" + file.name;

    file.mv(path2, function (err) {
      if (err) return res.status(500).send(err);
    });

    const newApplication = await Application.create({
      id: uuid.v4(),
      user: req.user.id,
      name: req.body.name,
      email: req.body.email,
      job: req.body.job,
      message: req.body.message,
      resume: file.name,
    });
    res.send(newApplication);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route delete api/applications
//desc delete application by id
//access public
router.delete("/", async (req, res) => {
  try {
    const application = await Application.findOneAndRemove({
      _id: req.body.id,
    });
    if (!application) {
      return res.status(404).send("Applicaiton not found");
    }

    res.send("application deleted");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
