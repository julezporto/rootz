/*
require("dotenv").config();

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})


// User table queries

// Gets all users
const getUsers = (request, response) => {
  pool.query('SELECT * FROM userAccount', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// See if user exists
const checkUser = (request, response) => {
  let { username } = request.body;
  pool.query('SELECT * FROM useraccount WHERE username = $1', [username], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

// Plant table queries

// Gets all Plants
const getPlants = (request, response) => {
  pool.query('SELECT * FROM plants', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Gets Plant by plantID
const getPlantById = (request, response) => {
  let plantID = parseInt(request.params.plantID);
  console.log("ID: " + plantID);
  plantID = 2

  pool.query('SELECT * FROM plants WHERE "plantID"=$1', [plantID], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getMostLikedPlant = (request, response) => {
  // this creates the view
  // pool.query('CREATE or REPLACE View PlantLikesView AS ' +
  //            '(SELECT "commonName", pID."num_likes" FROM plants natural join ' + 
  //            '(SELECT "plantID", count("username") AS num_likes FROM likes GROUP BY "plantID") pID)', (error, results) => {
  //   if (error) {
  //     throw error;
  //   }
  //   response.status(200).json(results.rows);
  // });

  pool.query('SELECT "commonName" FROM PlantLikesView WHERE num_likes = ' +
             '(SELECT MAX(num_likes) FROM PlantLikesView);', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const showPosts = (request, response) => {
  // this creates the view
  // pool.query('CREATE or REPLACE View showPosts As (select "title", "content", "rating" From Post);', (error, results) => {
  //   if (error) {
  //     throw error;
  //   }
  //   response.status(200).json(results.rows);
  // });
  pool.query('SELECT * FROM showPosts;', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const showUserFavoritePosts = (request, response) => {
  username = request.params.username;
  username = 'user3'
  console.log("ID: " + username);

  // this creates the view
  // pool.query('CREATE or REPLACE View showUserFavoritePosts As ' +
  //            '(SELECT "username", "title", "content", "rating" FROM ' +
  //              '(SELECT "title", "content", "rating", "postID", "username" FROM post NATURAL JOIN ' +
  //              '(SELECT "postID", "plantID", "username" FROM about NATURAL JOIN ' +
  //              '(SELECT "plantID", "username" FROM likes NATURAL JOIN ' +
  //              '(SELECT "username" FROM useraccount)))))', (error, results) => {
  //   if (error) {
  //     throw error;
  //   }
  //   response.status(200).json(results.rows);
  // });

  pool.query('SELECT "title", "content", "rating" FROM showUserFavoritePosts WHERE "username"=$1;', [username], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


module.exports = {
  getUsers,
  checkUser,
  getPlants,
  getPlantById,
  getMostLikedPlant,
  showPosts,
  showUserFavoritePosts
};
*/