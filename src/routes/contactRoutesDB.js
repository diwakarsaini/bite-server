const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

let Contact = require('../models/Contacts');

const uuid = require('uuid');

const router = express.Router();

const { check, validationResult } = require('express-validator');

const nodemailer = require('nodemailer');

//route Get api/todos
//desc Get all Todos
//access public
router.get('/', authMiddleware, async (req, res) => {
  try {
    const ContactDB = await Contact.find();
    res.send(ContactDB);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

//route Get api/todos/:id
//desc Get tod by id
//access public
router.get('/:id', async (req, res) => {
  try {
    const Contact = await Contact.findById(req.params.id);
    if (!Contact) {
      return res.status(404).send('Contact not found');
    }
    res.send(Contact);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

//route Post api/todos
//desc Insert todo
//access public
router.post('/', 
authMiddleware,
[
  check('name', 'Please enter your name').not().isEmpty(),
  check('email', 'Please enter valid email').not().isEmpty().isEmail(),
  check('phone', 'phone is required').not().isEmpty().isMobilePhone(),
],
async (req, res) => {
  try {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    const newContact = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
  
      auth: {
        user: 'nurlybekcan@gmail.com',
  
        pass: 'Bnb/1902',
      },
    });
  
    const mailOptions = {
      from: 'nurlybekcan@gmail.com',
  
      to: 'nurlybekcan@gmail.com',
  
      subject: 'Please, contact ' + newContact.name,
  
      text: 'Email ID: ' + newContact.email + '\nPhone Number: ' + newContact.phone,
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        return res.send(' email send');
      }
    });
    
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//route delete api/todos
//desc delete todo by id
//access public
router.delete('/', async (req, res) => {
  try {
    const Contact = await Contact.findOneAndRemove({ _id: req.body.id });
    if (!Contact) {
      return res.status(404).send('Contact not found');
    }

    res.send('Contact deleted');
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

//route put api/todos
//desc update todo
//access public
router.put('/', async (req, res) => {
  try {
    const Contact = await Contact.findById(req.body.id);
    if (!Contact) {
      return res.status(404).send('contact not found');
    }
    Contact.name = req.body.name;
    Contact.email = req.body.email;
    Contact.phone = req.body.phone;
    await Contact.save();
    res.send(Contact);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});



module.exports = router;
