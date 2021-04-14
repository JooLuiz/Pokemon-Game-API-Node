const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({msg: "Welcome to the home page of Pokemon Game API."});
})

module.exports = router;