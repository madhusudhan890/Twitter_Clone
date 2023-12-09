# Twitter_Clone

PREREQUISITES:

Node Js - 18.0.0 MongoDB 6.0

Node Packages Needed:

Express
dotenv
nodemon (development dependency)
mongoose
jsonwebtoken
express-validator
uuid

Environment setup:

Normal Server:

step 1: git clone https://github.com/madhusudhan890/Twitter_Clone.git

step 2: go into the project and run npm i (In case if nodemodules has not been there)

step 3: provide environmental variables like MONGO_URL etc in .env file before running the server. Along with please provide server port ,JWT secretkey. Here is the structure of enviroment variables:

        PORT = 3000
        SECRET = Ironman
        MONGO_URL =
    Provide environment variables based on your configuration.

step 4: Run npm run dev in folder terminal, To start the server.if environment varibales setup correctly ,server will run at PORT 3000.

step 5: Signup into the app to get JWT Token in order to access other services. IN order to get api endpoints go to routes/routes.js folder.

Here are few apis to follow through:

        1. http://localhost:3000/v1/api/signup      Method: POST , body: userName ,password, email
        2. http://localhost:3000/v1/api/login       Method: POST , body: password, email
        3. http://localhost:3000/v1/api/follow      Method: POST , body: followinguserCode  , authentication: Bearar TOken
        4. http://localhost:3000/v1/api/tweets      Method: POST , body: tweet , authentication: Bearar TOken
        5. http://localhost:3000/v1/api/tweets      Method: GET ,  authentication: Bearar TOken

step 6: Place JWT Token acquired during sign up process and use it for accessing other routes.

DESCRIPTION:

Javascript is the programming language being used in these project.

Express framework has been used to set up the server in node js . And MongoDB is being default Database.

How this works:

-> I understood based on project description is that users can follow other users ,see their tweets and can also place tweets.Based on this assumption i made 3 MONGODB models to do this project.Primarily users, followers and message models. With these 3 models i completed my task.

    userModel: To save user Data
    FollowersModel: To save data of followers
    MessageModel: To save the tweets of all people.
