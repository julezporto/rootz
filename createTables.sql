-- Create plants table
CREATE TABLE plants (
    plantID CHAR(3) PRIMARY KEY,
    commonName VARCHAR(30) NOT NULL,
    biologicalName VARCHAR(30) NOT NULL,
    family VARCHAR(30) NOT NULL,
    category VARCHAR(30) NOT NULL,
    origin VARCHAR(30) NOT NULL,
    climate VARCHAR(30) NOT NULL,
    brightnessIntensity VARCHAR(20) NOT NULL,
    brightnessDirection VARCHAR(20) NOT NULL,
    temperatureLowF INTEGER NOT NULL,
    temperatureHighF INTEGER NOT NULL,
    humidity NUMERIC NOT NULL,
    daysBetweenWatering INTEGER NOT NULL,
    imageURL VARCHAR(30) NOT NULL
);

-- Create userAccount table
CREATE TABLE userAccount (
    username VARCHAR(15) PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL
);

-- Create post table
CREATE TABLE post (
    postID CHAR(6) PRIMARY KEY,
    title VARCHAR(50),
    timestamp TIMESTAMP,
    content VARCHAR(300),
    rating INTEGER
);

-- Create about table
CREATE TABLE about (
    postID CHAR(6),
    plantID CHAR(3),
    CONSTRAINT pk_about PRIMARY KEY (postID, plantID),
    CONSTRAINT fk_about_postID FOREIGN KEY (postID) REFERENCES post(postID),
    CONSTRAINT fk_about_plantID FOREIGN KEY (plantID) REFERENCES plants(plantID)
);

-- Create makes table
CREATE TABLE makes (
    username VARCHAR(15),
    postID CHAR(6),
    CONSTRAINT pk_makes PRIMARY KEY (username, postID),
    CONSTRAINT fk_makes_username FOREIGN KEY (username) REFERENCES userAccount(username),
    CONSTRAINT fk_makes_postID FOREIGN KEY (postID) REFERENCES post(postID)
);

-- Create likes table
CREATE TABLE likes (
    plantID CHAR(3),
    username VARCHAR(15),
    CONSTRAINT pk_likes PRIMARY KEY (plantID, username),
    CONSTRAINT fk_likes_plantID FOREIGN KEY (plantID) REFERENCES plants(plantID),
    CONSTRAINT fk_likes_username FOREIGN KEY (username) REFERENCES userAccount(username)
);
