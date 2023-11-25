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
4. Input your database information into queries.js
5. Open the terminal and make sure you are in the Rootz folder directory
6. Make sure to install all dependencies:
      - Node: npm install -g npm
      - Express: npm i express
      - Body-Parser: npm install body-parser
      - Postgresql: npm install pg
      - DB: npm install db
      - Nodemon: npm i -D nodemon
7. Run `npm install`
8. Run `npm start` (or `npm run dev` to use nodemon)
9. Open a browser and go to localhost:3000
10. Check database connection by going to localhost:3000/plants
