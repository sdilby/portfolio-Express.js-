'use strict'

// Server
require('dotenv').config();
const express = require('express');
const app = express();
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');

// Environment
const ENV = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000;
const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_PASS = process.env.GMAIL_PASS

// Packages
const bodyParser = require('body-parser');
const router = express.Router();
const nodemailer = require('nodemailer');

// Register Partials
hbs.registerPartials(__dirname + '/views/partials');

// Set public page for static components. Add npm dependencies

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(__dirname + '/node_modules/font-awesome/'));
app.use(express.static(__dirname + '/node_modules/popper.js/dist/'));


// Middleware
// Does not call next(). Use for Maintenance to stop renders.
//app.use((req, res, next) => {
//  res.render('maintenance.hbs');
//});

// Helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

// Routes
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('home.hbs');
});

app.get('/about', (req, res) => {
  res.render('about.hbs');
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs');
});

app.get('/contact', (req, res) => {
  res.render('contact.hbs');
});

// POST route from contact form
app.post('/contact', (req, res) => {
  let mailOpts, smtpTrans
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  });
  mailOpts = {
    from: req.body.email + ' &lt;' + req.body.subject + '&gt;',
    to: GMAIL_USER,
    subject: 'New message from contact form at stevendilbert.com',
    text: `${req.body.email} (${req.body.subject}) says: ${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, (error) => {
    if (error) {
      console.log('Failed contact form attempt: ')
      console.log(mailOpts)
      res.render('contactFailure.hbs');
    }
    else {
      res.render('contactSuccess.hbs');
    }
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
