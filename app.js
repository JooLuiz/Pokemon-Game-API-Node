const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')
const session = require('express-session');
//Bring in models
const User = require("./models/user");

const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth")


//Passportconfig
// require('./config/passport')(passport);

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

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

//home route
app.get("/", (req, res) => {
    res.send("Hello World");
})

//fight aggainst a pokemon
app.get("/users", auth, (req, res) => {
    User.find({}, (err, users) => {
        if(err){
            res.status(500).json(err);
        }else{
            res.status(200).json(users);
        }
    });
})


app.get("/users/:id", auth, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(!err){
            res.status(200).json(user);
        }else{
            console.log(err)
            res.status(500).json(err);
        }
    })
})

app.post("/users/:id", auth, (req, res) => {
    let user = {}
    user.username = req.body.username;
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;

    let query = {_id:req.params.id}
    User.updateOne(query,user, (err) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            res.status(200).json(user);
        }
    })
})

app.delete("/users/:id", auth, (req, res) => {
    let query = {_id:req.params.id}

    User.deleteOne(query, (err) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            user = {
                id: req.params.id
            }

            res.status(200).json(user);
        }
    })
})

app.post("/auth/register", (req, res) => {
    let user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(req.body.password, salt, (err, hash) =>{
            if(err){
                throw err;
            }
            user.password = hash
        })
    })

    user.save((err) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }
    }).then(user => {
            jwt.sign(
                { id: user.id },
                config.get('jwtSecret'),
                { expiresIn: 3600 },
                (err, token) =>{
                    if(err) throw err;
                    res.status(200).json(token, user);
                }
            )
    });
})

app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({msg: "All fields must be filled"})
    }

    User.findOne({username})
    .then((user) => {
        if(!user) return res.status(400).json({msg: "User Doesnt Exist"})
        
        //Validate Password
        bcrypt.compare(password, user.password)
            .then((isMatch) => {
                if(!isMatch) return res.status(400).json({msg: "Wrong Password"})

                jwt.sign(
                    { id: user.id },
                    config.get('jwtSecret'),
                    { expiresIn: 3600 },
                    (err, token) =>{
                        if(err) throw err;
                        res.status(200).json(token, user);
                    }
                )
            })
    });
})

app.post("/auth", (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({msg: "All fields must be filled"})
    }

    User.findOne({username})
    .then((user) => {
        if(!user) return res.status(400).json({msg: "User Doesnt Exist"})
        
        //Validate Password
        bcrypt.compare(password, user.password)
            .then((isMatch) => {
                if(!isMatch) return res.status(400).json({msg: "Wrong Password"})

                jwt.sign(
                    { id: user.id },
                    config.get('jwtSecret'),
                    { expiresIn: 3600 },
                    (err, token) =>{
                        if(err) throw err;
                        res.status(200).json(token, user);
                    }
                )
            })
    });
})

//start server
app.listen(3000, () => {
    console.log("server up! port 3000...")
})