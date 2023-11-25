const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const path = require('path');
const { request } = require('http');
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Middleware to add json and bodyParser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("views"));


// Page Directory

// Direct to login page
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/views/index.html'));
});

// Direct to home page
app.get('/goHome', (request, response) => {
  response.sendFile(path.join(__dirname, '/views/home.html'));
});

// Direct to create account page
app.get('/goCreateAccount', (request, response) => {
  response.sendFile(path.join(__dirname, '/views/createAccount.html'));
});

// Direct to user page
app.get('/goUserPage', (request, response) => {
  response.sendFile(path.join(__dirname, '/views/user.html'));
});

// Direct to change pass page
app.get('/goChangePass', (request, response) => {
  response.sendFile(path.join(__dirname, '/views/changepass.html'));
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