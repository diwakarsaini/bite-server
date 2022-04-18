const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

let Event = require('../models/Events');

const uuid = require('uuid');

const router = express.Router();

const { check, validationResult } = require('express-validator');

//route Get api/todos
//desc Get all Todos
//access public
router.get('/', authMiddleware, async (req, res) => {
  try {
    const EventDB = await Event.find();
    res.send(EventDB);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

//route Get api/todos/:id
//desc Get tod by id
//access public
router.get('/:id', authMiddleware,  async (req, res) => {
  try {
    const response = await Event.findById(req.params.id);
    if (!response) {
      return res.status(404).send('Contact not found');
    }
    res.send(response);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//route Post api/todos
//desc Insert todo
//access public
router.post('/', 
authMiddleware,
[
  check('name', 'name is required').not().isEmpty(),
  check('event_site_url', 'event_site_url is required').not().isEmpty(),
  check('image_url', 'event_site_url is required').not().isEmpty(),
  check('description', 'event_site_url is required').not().isEmpty(),
  check('address', 'event_site_url is required').not().isEmpty(),
  check('city', 'event_site_url is required').not().isEmpty(),
  check('country', 'event_site_url is required').not().isEmpty(),
],
async (req, res) => {
  try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    const newEvent = await Event.create({
      name: req.body.name,
      event_site_url: req.body.event_site_url,
      address: req.body.address,
      image_url: req.body.image_url,
      description: req.body.description,
      city: req.body.city,
      country: req.body.country,
    });
    res.send(newEvent);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

//route delete api/todos
//desc delete todo by id
//access public
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const Event = await Event.findOneAndRemove({ _id: req.body.id });
    if (!Event) {
      return res.status(404).send('Contact not found');
    }

    res.send('Event deleted');
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

//route put api/todos
//desc update todo
//access public
router.put('/', authMiddleware, async (req, res) => {
  try {
    const Event = await Event.findById(req.body.id);
    if (!Event) {
      return res.status(404).send('todo not found');
    }
    Event.name = req.body.name;
    Event.event_site_url = req.body.event_site_url;
    Event.address = req.body.address;
    Event.image_url = req.body.image_url;
    Event.description = req.body.description;
    Event.city = req.body.city;
    Event.country = req.body.country;
    await Event.save();
    res.send(Event);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

module.exports = router;
