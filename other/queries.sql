drop Table likes;
drop Table makes;
drop Table about;
drop Table post;
drop Table userAccount;
drop Table plants;
drop view showPosts;
drop view showUserFavoritePosts;
drop view showUserPosts;

---------------------------------------------------------Tables creation starts here---------------------------------------
-- Create plants table
CREATE TABLE plants (
    plantID INTEGER PRIMARY KEY,
    commonName VARCHAR(25) NOT NULL,
    biologicalName VARCHAR(40) NOT NULL,
    family VARCHAR(16) NOT NULL,
    category VARCHAR(18) NOT NULL,
    origin VARCHAR(15) NOT NULL,
    climate VARCHAR(23) NOT NULL,
    brightnessIntensity VARCHAR(6) NOT NULL,
    brightnessDirection VARCHAR(8) NOT NULL,
    temperatureLowF INTEGER NOT NULL,
    temperatureHighF INTEGER NOT NULL,
    humidity NUMERIC(3, 1) NOT NULL,
    daysBetweenWatering INTEGER NOT NULL,
    imageURL CHAR(57) NOT NULL
);

-- Create userAccount table
CREATE TABLE useraccount (
    username VARCHAR(20) PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    password VARCHAR(20) NOT NULL
);

-- Create post table
CREATE TABLE post (
    postID INTEGER PRIMARY KEY,
    title VARCHAR(50),
    timestamp TIMESTAMP,
    content VARCHAR(300),
    rating INTEGER
);

-- Create about table
CREATE TABLE about (
    postID INTEGER,
    plantID INTEGER,
    CONSTRAINT pk_about PRIMARY KEY (postID, plantID),
    CONSTRAINT fk_about_postID FOREIGN KEY (postID) REFERENCES post(postID),
    CONSTRAINT fk_about_plantID FOREIGN KEY (plantID) REFERENCES plants(plantID)
);

-- Create makes table
CREATE TABLE makes (
    username VARCHAR(20),
    postID INTEGER,
    CONSTRAINT pk_makes PRIMARY KEY (username, postID),
    CONSTRAINT fk_makes_username FOREIGN KEY (username) REFERENCES userAccount(username),
    CONSTRAINT fk_makes_postID FOREIGN KEY (postID) REFERENCES post(postID)
);

-- Create likes table
CREATE TABLE likes (
    plantID INTEGER,
    username VARCHAR(20),
    CONSTRAINT pk_likes PRIMARY KEY (plantID, username),
    CONSTRAINT fk_likes_plantID FOREIGN KEY (plantID) REFERENCES plants(plantID),
    CONSTRAINT fk_likes_username FOREIGN KEY (username) REFERENCES userAccount(username)
);
---------------------------------------------------------Tables end here---------------------------------------

---------------------------------------------------------Triggers start here---------------------------------------
/* Triggers */
--------------------------------------------------------------------------------------------
---------------------------- Trigger for user password--------------------------------------
Create or replace Trigger userPasswordTrigger
Before Insert or Update on userAccount
For Each Row
Begin
    if(:new.password NOT Like '%!%' AND
        :new.password NOT Like '%@%' AND
        :new.password NOT Like '%#%' AND
        :new.password NOT Like '%$%' AND
        :new.password NOT Like '%^%' AND
        :new.password NOT Like '%*%')
        THEN Raise_Application_Error(-20004, 'password must have special character !@#$^*');
    End if;
    if(Length(:new.password) < 8)
        Then Raise_Application_Error(-20004, 'password must be at least 8 characters');
    End if;
End;
/
-----------------------------Password trigger for PGAdmin---------
CREATE OR REPLACE FUNCTION user_password_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.password !~ '.*[!@#$^*].*' THEN
        RAISE EXCEPTION 'Password must have at least one of the special characters: !@#$^*';
    END IF;

    IF LENGTH(NEW.password) < 8 THEN
        RAISE EXCEPTION 'Password must be at least 8 characters';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_password_trigger
BEFORE INSERT OR UPDATE ON userAccount
FOR EACH ROW
EXECUTE FUNCTION user_password_trigger_function();
---------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------


---------------------------------------------------------------------------------------------------
-------------------------------- Trigger for post content censorship-------------------------------
---------------------------------------------------------------------------------------------------
select * from Post;
Create or replace Trigger censor_comment
Before Insert on post
For Each Row
Begin
    -- Check if the comment contains any forbidden words
    IF (:new.content Like '%Stupid%' OR
        :new.content Like '%Fword%' OR
        :new.content Like '%Mad%' OR
        :new.content Like '%Idiot%') THEN
        -- Replace forbidden words with asterisks
        :new.content := regexp_replace(:new.content, '(Stupid|stupid|Fword|fword|Mad|mad|Idiot|idiot)', '****');
    END IF;
END;
/
---------------------------------------------------------------------------------------------------
-------------------------------Censorship Trigger for the PGAdmin----------------------------------
---------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION censor_comment_function()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the comment contains any forbidden words
    IF NEW.content ~* '(Stupid|Fword|Mad|Idiot)' THEN
        -- Replace forbidden words with asterisks
        NEW.content := regexp_replace(NEW.content, '(Stupid|Fword|Mad|Idiot)', '****', 'gi');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER censor_comment
BEFORE INSERT ON post
FOR EACH ROW
EXECUTE FUNCTION censor_comment_function();
-------------------------------------------Triggers end here---------------------------------------------------------------
-------------------------------------------------------------------------------------------

--------------------------------------Views start here---------------------------------------------------------------------
-------------------------------------------------------------------------------------------
/* Views */
-------------------------------------------------------------------------------------------
-- show only the title, content, and rating from the posts for the user view
-------------------------------------------------------------------------------------------

Create or replace View showPosts As (select title, content, rating From Post);
----------------as per PGAdmin
CREATE OR REPLACE VIEW showPosts AS 
SELECT title, content, rating 
FROM post;
-------------------------------------------------------------------------------------------
-- Show the posts about the user's favorite plants
-------------------------------------------------------------------------------------------
Create or replace view showUserFavoritePosts As
    (select title, content, rating
     From
        (select title, content, rating, postID From Post)
        natural join
        (select postID, plantID From About)
        natural join
        (select plantID, username From Likes)
        natural join
        (select username From userAccount)
     Where username = 'user3'); --replace 'username' with username input
----------------as per PGAdmin
CREATE OR REPLACE VIEW showUserFavoritePosts AS 
SELECT p.title, p.content, p.rating
FROM post p
JOIN about a ON p.postID = a.postID
JOIN likes l ON a.plantID = l.plantID
JOIN userAccount u ON l.username = u.username
WHERE u.username = 'user3';

-------------------------------------------------------------------------------------------
-- Show the posts created by the user logged in
-------------------------------------------------------------------------------------------
Create or replace view showUserPosts As
    (select title, content, rating
     From
        (select title, content, rating, postID From Post)
        natural join
        (select postID, username From makes)
        natural join
        (select username From userAccount)
     Where username = 'user4'); --replace 'username' with username input
----------------as per PGAdmin
CREATE OR REPLACE VIEW showUserPosts AS 
SELECT p.title, p.content, p.rating
FROM post p
JOIN makes m ON p.postID = m.postID
JOIN userAccount u ON m.username = u.username
WHERE u.username = 'user4';

-------------------------------------------------------------------------------------------
-- Get number of likes for each plant
-------------------------------------------------------------------------------------------
Create or replace View PlantLikesView AS
    (SELECT commonName, pID.num_likes
     FROM plants
     natural join
        (SELECT plantID, count(username) AS num_likes
         FROM likes
         GROUP BY plantID) pID);
----------------as per PGAdmin
CREATE OR REPLACE VIEW PlantLikesView AS 
SELECT plantID, COUNT(username) AS num_likes
FROM likes
GROUP BY plantID;

-------------------------------------------------------------------------------------------

/* Updates */
-- Update user password format & example
UPDATE userAccount
SET password = 'new_password'
WHERE username = 'desired_username';

/* Queries */
-- Get plant with max number of likes
SELECT commonName
FROM PlantLikesView
WHERE num_likes = (
    SELECT MAX(num_likes) FROM PlantLikesView
);

-- Select plants based on search filters
SELECT *
FROM plants
WHERE 
    (commonName LIKE '%search_term%' OR biologicalName LIKE '%search_term%')
    AND family = 'desired_family'
    AND category = 'desired_category'
    AND origin = 'desired_origin'
    AND climate = 'desired_climate'
    AND brightnessIntensity = 'desired_brightness_intensity'
    AND brightnessDirection = 'desired_brightness_direction'
    AND temperatureLowF >= desired_low_temp
    AND temperatureHighF <= desired_high_temp
    AND humidity >= desired_min_humidity
    AND daysBetweenWatering <= desired_max_days_between_watering;
    
-- Order by query examples for the posts
SELECT * FROM post
ORDER BY timestamp ASC;

SELECT * FROM post
ORDER BY timestamp DESC;

SELECT * FROM post
ORDER BY title ASC;

SELECT * FROM post
ORDER BY title DESC;