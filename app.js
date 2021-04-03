const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

//connecting to mongoDB
mongoose.connect('mongodb://localhost/pokemongame');

let db = mongoose.connection;

//Check Connection
db.once('open', () => {
    console.log('Connected to MongoDB')
})

//check for db erros
db.on('error', (err) => {
    console.log(err);
})

//init app
const app = express();

//Enabeling cors
app.use(cors());

//Bring in models
let User = require("./models/user");

//home route
app.get("/", (req, res) => {
    res.send("Hello World");
})

//fight aggainst a pokemon
app.get("/users", (req, res) => {
    User.find({}, (err, users) => {
        if(err){
            res.status(500).json(err);
        }else{
            res.status(200).json(users);
        }
    });
})

app.post("/users", (req, res) => {

})


//start server
app.listen(3000, () => {
    console.log("server up! port 3000...")
})