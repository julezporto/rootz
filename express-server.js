const { Pool } = require('pg');

// need to add .env file to hide database info on git

const pool = new Pool({
  user: 'your_username',
  password: 'your_password',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'your_database_name'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};