const mongoose = require('mongoose');

//Pokemon Schema
let pokemonSchema = mongoose.Schema({
    pokemonId:{
        type: String,
        required: true
    },
    baseExperience:{
        type: Number,
        required: true
    },
    height:{
        type: String,
        required: true
    },
    weight:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    abilities:{
        type: String,
        required: true
    },
    moves:{
        type: String,
        required: true
    }
})

let Pokemon = module.exports = mongoose.model('Pokemon', pokemonSchema);