const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Pokemon = require("../../models/pokemon");

router.get("/", auth, (req, res) => {
    Pokemon.find({userId: req.user.id}, (err, pokemons) => {
        if(err){
            res.status(500).json(err);
        }else{
            res.status(200).json(pokemons);
        }
    });
})


router.get("/:id", auth, (req, res) => {
    Pokemon.findById(req.params.id, (err, pokemon) => {
        if(err){
            console.log(err)
            res.status(500).json(err);
        }else{
            res.status(200).json(pokemon);
        }
    })
})

router.post("/new", auth, (req, res) => {
    let pokemon = new Pokemon();
    pokemon.pokemonId = req.body.pokemonId;
    pokemon.baseExperience = req.body.baseExperience;
    pokemon.height = req.body.height;
    pokemon.weight = req.body.weight;
    pokemon.name = req.body.name;
    pokemon.abilities = req.body.abilities;
    pokemon.moves = req.body.moves;

    pokemon
        .save()
        .then((pokemon, err) =>  {
            if(err){
                res.status(500).json(err);
            }else{
                res.status(201).json(pokemon)
            }
        })
})

router.post("/update/:id", auth, (req, res) => {
    let pokemon = {}
    pokemon.pokemonId = req.body.pokemonId;
    pokemon.baseExperience = req.body.baseExperience;
    pokemon.height = req.body.height;
    pokemon.weight = req.body.weight;
    pokemon.name = req.body.name;
    pokemon.abilities = req.body.abilities;
    pokemon.moves = req.body.moves;

    let query = {_id:req.params.id}
    Pokemon.updateOne(query,pokemon, (err) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            res.status(200).json(pokemon);
        }
    })
})

router.delete("/:id", auth, (req, res) => {
    let query = {_id:req.params.id}

    Pokemon.deleteOne(query, (err) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            pokemon = {
                id: req.params.id
            }

            res.status(200).json(pokemon);
        }
    })
})

module.exports = router;