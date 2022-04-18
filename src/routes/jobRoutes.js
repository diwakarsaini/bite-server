const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
let Job = require("../models/Job");

const uuid = require("uuid");

const router = express.Router();

const { check, validationResult } = require("express-validator");

//route Get api/jobs
//desc Get all Jobs
//access public
router.get("/", async (req, res) => {
  try {
    //const todoDB = await Todo.find();
    const job = await Job.find();
    res.send(job);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route Get api/jobs/:id
//desc Get job by id
//access public
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).send("Job is not found");
    }
    res.send(job);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route Post api/jobs
//desc Insert job
//access public
router.post(
  "/",
  authMiddleware,
  [
    check("name", "Name is required").not().isEmpty(),
    check("type", "Type is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newJob = await Job.create({
        id: uuid.v4(),
        user: req.user.id,
        name: req.body.name,
        location: req.body.location,
        type: req.body.type,
        expirience: req.body.expirience,
        role: req.body.role,
        description: req.body.description,
      });
      res.send(newJob);
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

//route delete api/jobs
//desc delete job by id
//access public
router.delete("/", async (req, res) => {
  try {
    const job = await Job.findOneAndRemove({ id: req.body.id });
    if (!job) {
      return res.status(404).send("job not found");
    }

    res.send("job deleted");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//route put api/jobs
//desc update job
//access public
router.put("/", async (req, res) => {
  try {
    const job = await Job.findById(req.body._id);
    if (!job) {
      return res.status(404).send("job not found");
    }
    console.log(job);
    job.name = req.body.name;
    job.location = req.body.location;
    job.user = req.body.user;
    job.type = req.body.type;
    job.expirience = req.body.expirience;
    job.role = req.body.role;
    job.description = req.body.description;
    await job.save();
    res.send(job);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
