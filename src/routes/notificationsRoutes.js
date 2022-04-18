const express = require("express");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
let Notification = require("../models/Notification");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id });
    res.send(notifications);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const newNotif = await Notification.create({
      user: req.user.id,
      name: req.body.name,
      type: req.body.type,
      date: new Date(),
    });
    res.send(newNotif);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

router.delete("/", async (req, res) => {
  try {
    const notif = await Notification.findOneAndRemove({ _id: req.query.id });
    if (!notif) {
      return res.status(404).send("Notificaiton not found");
    }

    res.send("Notification deleted");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
