const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require('bcryptjs')

router.post("/", (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({msg: "All fields must be filled"})
    }

    User.findOne({username})
    .then((user) => {
        if(!user) return res.status(400).json({msg: "User Doesnt Exist"})
        
        bcrypt.compare(password, user.password)
            .then((isMatch) => {
                if(!isMatch) return res.status(400).json({msg: "Wrong Password"})

                jwt.sign(
                    { id: user.id },
                    config.get('jwtSecret'),
                    { expiresIn: 3600 },
                    (err, token) =>{
                        if(err) throw err;
                        res.status(200).json({token, user: {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            username: user.username
                        }});
                    }
                )
            })
    });
})

router.post("/register", (req, res) => {
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
            user.save()
                .then(user => {
                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) =>{
                            if(err) throw err;
                            res.status(201).json({token, user: {
                                _id: user._id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                username: user.username
                            }});
                        }
                    )
            });
        })
    })
})

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({msg: "All fields must be filled"})
    }

    User.findOne({username})
    .then((user) => {
        if(!user) return res.status(400).json({msg: "User Doesnt Exist"})
        
        bcrypt.compare(password, user.password)
            .then((isMatch) => {
                if(!isMatch) return res.status(400).json({msg: "Wrong Password"})

                jwt.sign(
                    { id: user.id },
                    config.get('jwtSecret'),
                    { expiresIn: 3600 },
                    (err, token) =>{
                        if(err) throw err;
                        res.status(200).json({token, user: {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            username: user.username
                        }});
                    }
                )
            })
    });
})

router.post("/getLoggedUser", auth, (req, res) => {
    User.findById(req.user.id, '-password', (err, user) => {
        if(!err){
            res.status(200).json({user});
        }else{
            console.log(err)
            res.status(500).json(err);
        }
    })
})

module.exports = router;