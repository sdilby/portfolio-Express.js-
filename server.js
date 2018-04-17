const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();


const port = process.env.PORT || 3000;
const app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

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

app.use(bodyParser.urlencoded({extended: true}));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

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
app.post('/contact', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USE,
      pass: process.env.GMAIL_PASS,
    }
  });
  mailOpts = {
    from: req.body.email + ' &lt;' + req.body.subject + '&gt;',
    to: process.env.GMAIL_USER,
    subject: 'New message from contact form at stevendilbert.com',
    text: `${req.body.email} (${req.body.subject}) says: ${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
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
