const express = require("express");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
let Restaurant = require("../models/Restaurant");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ user: req.user.id });
    res.send(restaurants);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found");
    }
    res.send(restaurant);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

router.post(
  "/",
  authMiddleware,
  [
    check("name", "Make is required").not().isEmpty(),
    check("cuisine", "Model is required").not().isEmpty(),
    check("price", "Year is invalid").not().isEmpty(),
    check("location", "Year is invalid").not().isEmpty(),
    check("hours", "Year is invalid").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newRestaurant = await Restaurant.create({
        user: req.user.id,
        picture: req.body.picture,
        rating: req.body.rating,
        options: req.body.options,
        name: req.body.name,
        cuisine: req.body.cuisine,
        price: req.body.price,
        location: req.body.location,
        hours: req.body.hours,
      });
      res.send(newRestaurant);
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

router.delete("/", async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndRemove({ _id: req.body.id });
    if (!restaurant) {
      return res.status(404).send("Restaurant not found");
    }

    res.send("Restaurant deleted");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

router.put("/", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.id);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found");
    }
    (restaurant.name = req.body.name),
      (restaurant.cuisine = req.body.cuisine),
      (restaurant.price = req.body.price),
      (restaurant.location = req.body.location),
      (restaurant.hours = req.body.hours);
    await restaurant.save();
    res.send(restaurant);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
