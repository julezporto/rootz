const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const path = require('path');
const port = 3000

// Middleware to add json and bodyParser
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Direct to login page on window load
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/views/index.html'));
})

// Gets all plants
app.get('/plants', db.getPlants)
// Gets plant by plantID - Does not work
app.get('/plants/:plantID', db.getPlantById)

// app.post('/users', db.createUser)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)

// Start localhost
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})