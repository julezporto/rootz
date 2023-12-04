const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { pool } = require("./dbConfig");
const port = 3000;
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

// Middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.set('view engine', 'ejs');

const LocalStrategy = require('passport-local').Strategy;

// current user variable
var theCurrentUser = null;

// User login verification and user session setup
function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = (username, password, done) => {
    console.log(username, password);
    pool.query(
      `SELECT * FROM useraccount
      WHERE username = $1`,
      [username],
      (error, results) => {
        if (error) {
          throw error;
        }
        console.log(results.rows);

        // if the username exists in the database
        if (results.rows.length > 0) {
          const user = results.rows[0];

          // if the user's password matches that user's password in the database
          if (password === user.password) {
            // set the current user to the username of the account that just logged in
            theCurrentUser = username;
            console.log(theCurrentUser);
            return done(null, user);
          }
          // if the user's password does not match that user's password in the database
          else {
            // send user an incorrect pass error
            // NOTE: currently this just crashes
            return done(null, false, { message: "Password incorrect" });
          }
        }
        // if the username does not exist in the database
        else {
          // send user a username not registered error
          // NOTE: currently this just crashes
          return done(null, false, { message: "Username not registered" });
        }
      }
    )
  }

  passport.use(
    new LocalStrategy({
      usernameField: "username",
      passwordField: "password"
    },
    authenticateUser)
  );

  passport.serializeUser((user, done) => done(null, user.username));

  passport.deserializeUser((username, done) => {
    pool.query(
      `SELECT * FROM useraccount
      WHERE username = $1`,
      [username],
      (error, results) => {
        if (error) {
          throw error;
        }
        return done(null, results.rows[0]);
      }
    )
  });
}

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

initialize(passport);


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

  // If password does not have at least one special character (!@#$^*), return error
  if (!password.includes("!") && !password.includes("@") && !password.includes("#") && !password.includes("$")
       && !password.includes("^") && !password.includes("*")) {
    errors.push({ message: "Password must contain at least 1 special character: !@#$^*" });
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

// To change user password
app.post('/users/changePass', (request, response) => {
  console.log(theCurrentUser);

  // Get user input
  let { oldPassword, newPassword } = request.body;
  
  console.log(oldPassword);
  console.log(newPassword);
  
  // Setup field errors
  let errors = [];

  // If a field is empty, return error
  if (!oldPassword || !newPassword) {
    errors.push({message: "Please enter all fields"});
  }

  // If new password is too long, return error
  if (newPassword.length > 20) {
    errors.push({message: "New password must be less than 20 characters"});
  }

  // If new password is too short, return error
  if (newPassword.length < 8) {
    errors.push({ message: "New password should be at least 8 characters" });
  }

  // If new password does not have at least one special character, return error
  // TODO: add the rest of the special characters
  if (!newPassword.includes("!")) {
    errors.push({ message: "New password must contain at least 1 special character" });
  }

  // If new password and old password match, return error
  if (oldPassword === newPassword) {
    errors.push({ message: "New password must be different than old password" });
  }

  // If form validation does not pass:
  if (errors.length > 0) {
    // Display errors to the user
    response.render('changePass', { errors });
  }

  // If form validation does pass:
  else {
    // Check to see if the old password is correct
    pool.query(
      `SELECT * FROM useraccount
      WHERE username = $1 AND password = $2`,
      [theCurrentUser, oldPassword],
      (error, results) => {
        if(error) {
          throw error;
        }

        // If the password not correct
        if (results.rows.length === 0) {
          // Tell the user the password is incorrect
          errors.push({ message: "Old password is incorrect" })
          response.render('changePass', { errors })
        }

        // If the password is correct
        else {
          // Update the user's password in the database
          pool.query(
            `UPDATE userAccount
            SET password = $1
            WHERE username = $2`,
            [newPassword, theCurrentUser],
            (error, results) => {
              if (error) {
                throw error;
              }
              // Tell the user their password has been updated
              request.flash('success_msg', "Your password has been successfully updated");
              response.redirect('/users/dashboard');
            }
          )
        }
      }
    )
  }
});


// When the user logs in...
app.post('/users/login', passport.authenticate('local', {
  // If the user's password is correct, direct them to their user page
  successRedirect: "/users/dashboard", 
  // If the user's password is not correct, send error message & have them try again
  failureRedirect: '/users/index',
  failureFlash: true
}));

// Favorited plants
app.get('/users/dashboard/addFavorite', (request, response) => {
  response.render('user', { user: request.user.name });
});

app.post('/users/dashboard/addFavorite', (request, response) => {
  username = request.user.username
  // Get user input
  let { plantID } = request.body;
  console.log(username + " " + plantID)

  // Setup field errors
  let errors = [];

  // If a field is empty, return error
  if (!username || !plantID) {
    errors.push({message: "Please enter all fields"});
  }

  // If form validation does pass:
  else {
          // Insert user info into the database
          pool.query(
            `INSERT INTO likes (plantid, username)
            VALUES ($1, $2)
            RETURNING username`,
            [plantID, username],
            (error, results) => {
              if (error) {
                throw error;
              }
            }
          )
          console.log(username + " " + plantID)
        }
        response.render('user', { user: request.user.name });
});

// To show all plants ------------------------------------------------------------------------------------------------------
app.get('/plants/showAll', (request, response) => {
  pool.query(
    'SELECT * FROM plants',
    [],
    (error, results) => {
      if (error) {
        console.log("Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
        return;
      } 
      if (results.rows.length > 0) {
        console.log("Results:", results.rows);
        response.status(200).json(results.rows);
      } 
      else {
        console.log("There are no plants in the database");
        response.status(404).json({ message: "No plants found" });
      }
    }
  );
});

// Filter Plants ------------------------------------------------------------------------------------------------------
app.post('/plants/plantsFilter', (request, response) => {
  console.log("testtttt");
  // Accessing request body
  const requestBody = request.body;
  console.log("Request Body:", requestBody);

  // Accessing specific parameters from the request body 
  const { brightness, temperature, humidity, water } = request.body;
var newBrightness, newBrightnessIntensity, newBrightnessDirection, newTemperature, newTemperatureLowF, newTemperatureHighF, newHumidity, newWater;
const values = [];

let query = `SELECT * FROM plants
WHERE `

newBrightness = brightness;
newTemperature = temperature;
newHumidity = humidity;
newWater = water;


  if (brightness != null && temperature != null) {

    if (newHumidity == "any")
    {
      console.log("Inside any humidity");
      newHumidity = 4;
      query += `   "humidity" <= $${values.length + 1}`;
      values.push(newHumidity);
    }
    else{
      query += `   "humidity" <= $${values.length + 1}`;
      values.push(newHumidity);
    }
if (newWater == "any")
{
  console.log("Inside any water");
}
else{
  query += `   AND "daysBetweenWatering" <= $${values.length + 1}`;
  values.push(newWater);
}

    console.log("Brightness Value:", brightness);
    const [brightnessIntensity, brightnessDirection] = brightness.split('_');
    console.log("Temperature Value:", temperature);

    // Splitting temperature into low and high
    const [temperatureLowF, temperatureHighF] = temperature.split('to').map(value => value.trim());

    if (temperatureHighF == null)
    {
      console.log("Inside undefined temperatureHighF");
    }
    else{
    newTemperatureLowF = temperatureLowF;
    newTemperatureHighF = temperatureHighF;    
    query += ` AND "temperatureLowF" = $${values.length + 1}`;
    values.push(newTemperatureLowF);
    query += `  AND "temperatureHighF" >= $${values.length + 1}`;
    values.push(newTemperatureHighF);

    }
    if (brightnessDirection == null)
    {
      console.log("Inside undefined brightnessDirection");
    }
    else{
      console.log("Inside else");
      newBrightnessDirection = brightnessDirection;
      newBrightnessIntensity = brightnessIntensity;
      query += `  AND "brightnessIntensity" = $${values.length + 1}`;
      values.push(newBrightnessIntensity);
      query += ` AND "brightnessDirection" = $${values.length + 1}`;  
      values.push(newBrightnessDirection);
    }


    console.log("Brightness Intensity:", brightnessIntensity);
    console.log("Brightness Direction:", brightnessDirection);
    console.log("Temperature Low F:", temperatureLowF);
    console.log("Temperature High F:", temperatureHighF);
    console.log("Humidity:", humidity);
    console.log("Water:", water); // Change from 'daysBetweenWatering' to 'water'

    console.log("new brightness value")
    console.log("Brightness Intensity:", newBrightnessIntensity);
    console.log("Brightness Direction:", newBrightnessDirection);
    console.log("Temperature Low F:", newTemperatureLowF);
    console.log("Temperature High F:", newTemperatureHighF);
    console.log("Humidity:", newHumidity);
    console.log("Water:", newWater); // Change from 'daysBetweenWatering' to 'water'


 
    pool.query(
      query,
      values,
      (error, results) => {
        if (error) {
          console.log("Error:", error);
          response.status(500).json({ error: "Internal Server Error" });
          return;
        } 
        if (results.rows.length > 0) {
          console.log("Results:", results.rows);
          response.status(200).json(results.rows);
        } 
        else {
          console.log("There is no plant that fits that description");
          response.status(404).json({ message: "No matching plants found" });
        }
      }
    );
  }
});

//get root with max number of likes ------------------------------------------------------------------------------------------------------
app.get('/plants/getbestrootz', (request, response) => {
  pool.query(
    `SELECT plantid, COUNT(*) AS like_count
    FROM public.likes
    GROUP BY plantid
    ORDER BY like_count DESC
    LIMIT 1`,
    [],
    (error, results) => {
      if (error) {
        console.log("Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
        return;
      } 
      if (results.rows.length > 0) {
        console.log("Results:", results.rows);
        response.status(200).json(results.rows);
      } 
      else {
        console.log("There are no plants in the database");
        response.status(404).json({ message: "No plants found" });
      }
    }
  );
});

//get plant details ------------------------------------------------------------------------------------------------------
app.get('/plants/getplantdetails', (request, response) => {
  const { plantID } = request.query;
  pool.query(
    `SELECT *
    FROM public.plants
    WHERE "plantID" = $1`,
    [plantID],
    (error, results) => {

      if (error) {
        console.log("Error:", error);
        response.status(500).json({ error: "Internal Server Error" });
        return;
      } 
      if (results.rows.length > 0) {
        console.log("Results:", results.rows);
        response.status(200).json(results.rows);
      } 
      else {
        console.log("There are no plants in the database");
        response.status(404).json({ message: "No plants found" });
      }
    }
  );
});
//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------

// Best Rootz - not working code.
/*
app.post('/users/home', (request, response) => {
  pool.query(
    `SELECT "plantID"
    FROM PlantLikesView
    WHERE num_likes = (
      SELECT MAX(num_likes) FROM PlantLikesView
    )`,
    (error, results) => {
      if (error) {
         throw error;
      }
      // If there is one plant with the max likes
      if (results.rows.length === 1) {
        // Send the plantID result
        //response.send(result);
        console.log(result);
      }
      else if (results.rows.length > 1) {
        // Pick one if there are multiple

      }
    }
  )
  //response.render('home');
});
*/

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