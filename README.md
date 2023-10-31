# Rootz

### WPI DBMS Final Project
Created by Juliana Porto, Julie Vieira, Khushita Joshi, and Adhiraj Budukh

The Rootz application is a full-stack web application designed to help users in selecting plants according to their unique preferences. Developed by a skilled team utilizing HTML, CSS, JavaScript, Node.js, Express.js, and Oracle SQL, "Rootz" focuses on enhancing database management and seamlessly connecting the frontend and backend. With a meticulous approach to data collection and cleaning, the application incorporates a rich feature set, including user-friendly filters, a secure login system with password specifications, plant liking, top plant of the day based on the highest number of likes, and a comment option with censoring. By skillfully merging our team’s diverse talents and utilizing these technologies, "Rootz" offers plant enthusiasts a tailored, reliable platform for all their plant needs, underpinned by a robust database structure. 

## Project Description
Our team is developing an application called Rootz where a user may select various filter options and a curated list of plants will be produced which align with those filters. For example, if the user wants a plant in a low light condition, they may select the ‘low light’ option. The application will return a list of potential plants that meet these requirements. Other filters that can be used are family, category, origin, category, temperature, humidity, and days between watering. These filters are dependent on our gathered dataset which is described below in the Dataset section. 

Besides the main filter and search feature described above (feature 1), we will be implementing several other query- and trigger-based features.  

The second feature being implemented will be related to user login. Each user will have a unique username and password to access their specific account and a trigger will be used to make sure the user’s password is secure (contains a special character and is a certain length). There will also be an option to update a user’s password.  

The third feature will be a like feature. Users can like specific plants and those plants will be displayed in their specific user account using a view. Also, each plant will use aggregation to display how many users have liked that specific plant.  

The fourth feature will be an option for users to comment on each plant. To make sure all comments are appropriate, there will be a censorship trigger created to make sure there is no hateful or inappropriate language.  

Lastly, the fifth feature will be what we call “Best Rootz” which will display the plant with the highest number of likes to all users, so that users can see what plant other users are most interested in. 

## Goals
Our main goal is to create an application that: 
1. Utilizes the skills and tools learned throughout the DBMS course
2. Has persistent and accurate data storage
3. Provides a friendly experience for users
4. Produces results in an efficient manner
5. Provides a variety of functionality that both apply concepts discussed in class and keep the user engaged in the application

## User Group
The user group for this application is anyone and everyone that enjoys or wants plants in their everyday spaces. 

## Data Set
For our database, we will be using one main data set. This data set has been curated from two separate data sources. The first was "indoor plants data set from api” downloaded from Kaggle. To clean this dataset, several steps were required. This included removing any records with missing data entries, fixing data entry spacing, and removing duplicates. This cleaned dataset was then merged with “Indoor plants DataSet” from Zenodo. All overlapping common names were matched and the appropriate data was included. The biggest issue with this dataset was that the brightness, temperature, humidity, and watering columns had random number values with no explanation to be found. Thankfully, we have plant expertise on our team and were able to decipher these numbers, replacing them with usable values. In the end, this data set ended up containing 13 columns (common_name, biological_name, family, category, origin, climate, brightness_intensity, brightness_direction, temperature_low_f, temperature_high_f, humidity_high1_low3, days_between_watering, img_url) and 62 records. These records plus the data being inputted by users (and sample data) will allow us to run all of our queries. 

