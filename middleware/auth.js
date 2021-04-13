const config = require('config');
const jwt = require("jsonwebtoken");

function auth(req, res, next){
    
    const token = req.header('x-auth-token');

    //Check for token
    if(!token) return res.status(401).json({msg: "Permission Denied, no token authorization was sent"});
    
    try{
        //Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
    
        //Add User from payload
    
        req.user = decoded;
        next();
    } catch(e){
        return res.status(400).json({msg: 'Token is not valid'})
    }
}

module.exports = auth;