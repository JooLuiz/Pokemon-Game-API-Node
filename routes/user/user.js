const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/user");

//fight aggainst a pokemon
router.get("/", auth, (req, res) => {
    User.find({}, (err, users) => {
        if(err){
            res.status(500).json(err);
        }else{
            res.status(200).json(users);
        }
    });
})


router.get("/:id", auth, (req, res) => {
    User.findById(req.params.id, '-password', (err, user) => {
        if(!err){
            res.status(200).json(user);
        }else{
            console.log(err)
            res.status(500).json(err);
        }
    })
})

router.post("/:id", auth, (req, res) => {
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
            res.status(200).json({user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username
            }});
        }
    })
})

router.delete("/:id", auth, (req, res) => {
    let query = {_id:req.params.id}

    User.deleteOne(query, (err) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            user = {
                id: req.params.id
            }

            res.status(200).json({user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username
            }});
        }
    })
})

module.exports = router;