const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

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


app.get("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(!err){
            res.status(200).json(user);
        }else{
            console.log(err)
            res.status(500).json(err);
        }
    })
})

app.post("/users/register", (req, res) => {
    let user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.password = req.body.password;

    user.save((err) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            //DESCOMMENT WHEN AUTHENTICATION IS READY
            //res.status(200).json(users);
        }
    });
})

app.put("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(!err){
            user.username = req.body.username;
            user.email = req.body.email;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.password = req.body.password;
        
            user.save((err) => {
                if(err){
                    console.log(err);
                    res.status(500).json(err);
                }else{
                    res.status(200).json(user);
                }
            });
        }else{
            console.log(err);
            res.status(500).json(err);
        }
    })
})

app.delete("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(!err){
            user.delete();
        }else{
            console.log(err)
            res.status(500).json(err);
        }
    })
})

app.post("/users/login", (req, res) => {

})

//start server
app.listen(3000, () => {
    console.log("server up! port 3000...")
})