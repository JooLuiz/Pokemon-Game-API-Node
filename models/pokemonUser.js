const mongoose = require('mongoose');

//PokemonUser Schema
let pokemonUserSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    pokemonId:{
        type: String,
        required: true
    },
    pokemonName:{
        type: String,
        required: true
    },
    pokemonLevel:{
        type: String,
        required: true
    },
    pokemonExp:{
        type: String,
        required: true
    }
})

let PokemonUser = module.exports = mongoose.model('PokemonUser', pokemonUserSchema);