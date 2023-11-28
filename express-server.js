const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { pool } = require("./dbConfig");
const port = 3000;
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const initializePassport = require("./passportConfig");
initializePassport(passport);

// Middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.set('view engine', 'ejs');
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Page Directory

// Direct to home page
app.get('/', (request, response) => {
  response.render('index');
});

// Direct to create account page
app.get('/users/createAccount', checkAuthenticated, (request, response) => {
  response.render('createAccount');
});

// Direct to login page
app.get('/users/login', checkAuthenticated, (request, response) => {
  response.render('index');
});

app.get("/users/logout", (request,response) => {
    request.logOut(function(error) {
        if (error) { return next(error); }
        request.flash("success_msg", "You have successfully logged out.");
        response.redirect("/users/login");
    });
});

// Direct to user page
app.get('/users/dashboard', checkNotAuthenticated, (request, response) => {
  response.render('user', { user: request.user.name });
});

// Direct to user page
app.get('/users/changePass', (request, response) => {
  response.render('changePass');
});

// Direct to home page
app.get('/users/home', (request, response) => {
  response.render('home');
});


// User

// Create new user account
app.post('/users/createAccount', (request, response) => {
  // Get user input
  let { name, username, password, password2 } = request.body;

  // Setup field errors
  let errors = [];

  // If a field is empty, return error
  if (!name || !username || !password || !password2) {
    errors.push({message: "Please enter all fields"});
  }

  // If username is too long, return error
  if (username.length > 20) {
    errors.push({message: "Username must be less than 20 characters"});
  }

  // If name is too long, return error
  if (name.length > 40) {
    errors.push({message: "Name must be less than 40 characters"});
  }

  // If password is too long, return error
  if (password.length > 20) {
    errors.push({message: "Password must be less than 20 characters"});
  }

  // If password is too short, return error
  if (password.length < 8) {
    errors.push({ message: "Password should be at least 8 characters" });
  }

  // If password does not have at least one special character, return error
  // TODO: add the rest of the special characters
  if (!password.includes("!")) {
    errors.push({ message: "Password must contain at least 1 special character" });
  }

  // If password 1 doesn't match password 2, return error
  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  // If form validation does not pass:
  if (errors.length > 0) {
    // Display errors to the user
    response.render('createAccount', { errors });
  }

  // If form validation does pass:
  else {
    // Check to see if the user already exists based on the username
    pool.query(
      `SELECT * FROM useraccount
      WHERE username = $1`,
      [username],
      (error, results) => {
        if(error) {
          throw error;
        }

        // If the user already exists
        if (results.rows.length > 0) {
          // Tell the user the account already exists & can login
          errors.push({ message: "User already exists. Please login" })
          response.render('createAccount', { errors })
        }

        // If the user does not yet exist
        else {
          // Insert user info into the database
          pool.query(
            `INSERT INTO useraccount (name, username, password)
            VALUES ($1, $2, $3)
            RETURNING username, password`,
            [name, username, password],
            (error, results) => {
              if (error) {
                throw error;
              }
              // Tell the user they are now registered & can login
              request.flash('success_msg', "You are now registered. Please login.");
              response.redirect('/users/login');
            }
          )
        }
      }
    )
  }
})

// When the user logs in...
app.post('/users/login', passport.authenticate('local', {
  // If the user's password is correct, direct them to their user page
  successRedirect: "/users/dashboard", 
  // If the user's password is not correct, send error message & have them try again
  failureRedirect: '/users/index',
  failureFlash: true
}));

// Middleware for user access if user is logged in
function checkAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return response.redirect('/users/dashboard');
  }
  next();
}

// Middleware for user access if user is not logged in
function checkNotAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect('/users/login');
}

// Start localhost
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});