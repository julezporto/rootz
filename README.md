# Rootz

### WPI DBMS Final Project

Created by Juliana Porto, Julie Vieira, Khushita Joshi, and Adhiraj Budukh

#### Setting Up Dev Environment

1. Clone this repo
2. Set up Postgresql database

   a. [Download postgres](https://www.postgresql.org/download/)

   b. Open pgAdmin

   c. [Create Sever & Database in pgAdmin](https://www.youtube.com/watch?v=oWsAYx2R9RI)

   d. Create tables in pgAdmin - Table setup can be found in other > queries.sql

3. Input your database information into queries.js
4. Open the terminal and make sure you are in the Rootz folder directory
5. Make sure to install all dependencies:
   - Node: npm install -g npm
   - Express: npm i express
   - Body-Parser: npm install body-parser
   - Postgresql: npm install pg
   - DB: npm install db
   - Nodemon: npm i -D nodemon
   - Env: npm i dotenv
   - Session: npm i express-session
   - Flash: npm i express-flash
   - Passport: npm i passport passport-local
6. Run `npm install`
7. Run `npm start` (or `npm run dev` to use nodemon)
8. Open a browser and go to localhost:3000
9. Check database connection by going to localhost:3000/plants
