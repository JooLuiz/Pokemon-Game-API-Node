const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const PokemonUser = require("../../models/pokemonUser");

router.get("/", auth, (req, res) => {
    PokemonUser.find({userId: req.user.id}, (err, pokemonUsers) => {
        if(err){
            res.status(500).json(err);
        }else{
            res.status(200).json(pokemonUsers);
        }
    });
})


router.get("/:id", auth, (req, res) => {
    PokemonUser.findById(req.params.id, (err, pokemonUser) => {
        if(err){
            console.log(err)
            res.status(500).json(err);
        }else{
            res.status(200).json(pokemonUser);
        }
    })
})

router.post("/new", auth, (req, res) => {
    let pokemonUser = new PokemonUser();
    pokemonUser.userId = req.user.id;
    pokemonUser.pokeomId = req.body.pokemonId;
    pokemonUser.pokemonName = req.body.pokemonName;
    pokemonUser.pokemonLevel = req.body.pokemonLevel;
    pokemonUser.pokemonExp = req.body.pokemonExp;

    pokemonUser
            .save()
            .then((pokemonUser, err) =>  {
                if(err){
                    res.status(500).json(err);
                }else{
                    res.status(201).json(pokemonUser)
                }
            })
})

router.post("/update/:id", auth, (req, res) => {
    let pokemonUser = {}
    pokemonUser.pokemonName = req.body.pokemonName;
    pokemonUser.pokemonLevel = req.body.pokemonLevel;
    pokemonUser.pokemonExp = req.body.pokemonExp;

    let query = {_id:req.params.id}
    PokemonUser.updateOne(query,pokemonUser, (err) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            res.status(200).json(pokemonUser);
        }
    })
})

router.delete("/:id", auth, (req, res) => {
    let query = {_id:req.params.id}

    PokemonUser.deleteOne(query, (err) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            pokemonUser = {
                id: req.params.id
            }

            res.status(200).json(pokemonUser);
        }
    })
})

module.exports = router;