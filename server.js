const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');



const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Use section to create log of requests
//app.use((req, res, next) => {
//  var now = new Date().toString();
//  var log =`${now}: ${req.method} ${req.url}`
//  console.log(log);
//  fs.appendFile('server.log', log + '\n', (err) => {
//    if (err) {
//      console.log('Unable to append to server.log')
//    }
//    next();
//  });
//});

// Does not call next(). Use for Maintenance to stop renders.
//app.use((req, res, next) => {
//  res.render('maintenance.hbs');
//});

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

//hbs.registerHelper('screamIt', (text) => {
//  return text.toUpperCase()
//});

// Example of variables that can be used on specific pages with {{variableName}}
// creates key value pairs to make variables
//app.get('/', (req, res) => {
//  res.render('home.hbs', {
//    pageTitle: 'Home Page',
//    welcomeMessage: 'Welcome to my website',
//  });
//});


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

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
