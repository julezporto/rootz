const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const path = require('path');
const { request } = require('http');
const port = 3000;
const router = express.Router();

// Middleware to add json and bodyParser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("views"));

app.set('view engine', 'ejs');

// Page Directory

// Direct to home page
app.get('/', (request, response) => {
  response.render('home');
});

// Direct to create account page
app.get('/users/createAccount', (request, response) => {
  response.render('createAccount');
});

// Direct to login page
app.get('/users/login', (request, response) => {
  response.render('index');
});

app.get('/users/logout', (request, response) => {
  response.render('index');
})

// Direct to user page
app.get('/users/dashboard', (request, response) => {
  response.render('user', { user: "Some user" });
});

// Direct to user page
app.get('/users/changePass', (request, response) => {
  response.render('changePass');
});


// Table requests

// Gets all plants
app.get('/plants', db.getPlants);
// Gets plant by plantID - Does not work
app.get('/plants/plantID', db.getPlantById);

// testing queries
app.get('/test', db.showUserFavoritePosts);

// app.post('/users', db.createUser)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)

// Start localhost
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});