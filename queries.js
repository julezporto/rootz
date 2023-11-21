const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "RootzDB",
    password: "Jp013015665!",
    port: 5432,
})

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
// FIXME: getPlantById in queries.js has undefined column error
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



// Below queries were taken from example so table and attribute names are incorrect
/*
const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}
*/

module.exports = {
  getPlants,
  getPlantById,
  getMostLikedPlant,
  showPosts,
  showUserFavoritePosts
};