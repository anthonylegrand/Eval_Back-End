require('dotenv').config()
const JWT = require('jsonwebtoken');
const controller = require("../controllers/account.controller.js");

exports.auth = (req, res, next) => {
    const token = req.get("Authorization");
    const JWT_data = JWT_to_json(token)
    
    if(JWT_data?.compteID || JWT_data?.token){
        req.compteID = JWT_data.compteID;
        req.token = JWT_data.token;
        next()
    }else{
        const {username, password} = req.body
        if(username && password){
            controller.login(req, body, next)
        }
    }
}

function JWT_to_json(token){
    try {
        return JWT.verify(token.replace('Bearer ', ''), process.env.JWT_TOKEN)
    } catch (error) {
        return null
    }
}