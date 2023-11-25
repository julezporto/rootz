const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConfig');

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

                if (results.rows.length > 0) {
                    const user = results.rows[0];

                    if (password === user.password) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Password incorrect" });
                    }
                }
                else {
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

module.exports = initialize;