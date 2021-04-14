const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

mongoose.connect('mongodb://localhost/pokemongame');

let db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB')
})

db.on('error', (err) => {
    console.log(err);
})

const app = express();

app.use(cors());

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

app.use('/', require("./routes/home/home"));

app.use('/users', require("./routes/user/user"));

app.use('/auth', require("./routes/auth/auth"));

app.listen(3000, () => {
    console.log("server up! port 3000...")
})