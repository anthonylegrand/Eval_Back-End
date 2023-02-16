require('dotenv').config()
const axios = require('axios');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs')

exports.login = async (req, res, next) => {
    const {username, password} = req.body
    const AuthJSON = {username, password}
    
    await blizard_auth(AuthJSON)
        .then(result => {
            res.setHeader('token', result.token)
            res.status(200).json(result);
            next()
        })
        .catch(error => {
            console.log('')
        })

    if(!res.finished){
        await local_auth(AuthJSON)
            .then(result => {
                if(result){
                    const _JWT = JWT.sign({token: result, isAdmin: true}, process.env.JWT_TOKEN, {expiresIn: "365 days"});
                    res.setHeader('adminToken', _JWT)
                    res.status(200).json({token: _JWT});
                    next()
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    if(!res.finished){
        res.status(400).json({error: 'Bad username or password'});
        addLogRaw()
    }
}

exports.getAll = (req, res, next) => {
    mongoose.model('perssonage').find({ compteID: req.params.compteID }, (err, docs) => {
        if(docs){
            res.status(200).json(docs)
        }else{
            res.status(400).json({ error: `Le compteID ${req.params.compteID} est inconu.` })
        }
    })
}

function blizard_auth(jsonAuth){
    return new Promise((resolve, reject) => {
        axios.post('https://backend-tp-final-nodejs.agence-pixi.fr/wow/compte/check', jsonAuth)
        .then((response) => {
            resolve({token: response.data.token})
        })
        .catch((error) => {
            reject(error)
        });
    })
}

function local_auth(jsonAuth){
    return new Promise((resolve, reject) => {
        mongoose.model('admin_account').findOne(jsonAuth, (err, doc) => {
            if(err)
                reject(err)
            if(doc)
                resolve(doc._id)
            else
                resolve(null)
        })
    })
}

function addLogRaw(){
    try {
        fs.appendFileSync('./auth_log.txt', new Date().toLocaleString('fr-FR')+' : Tentative de connexion invalide\n', "utf8");
      } catch (e) {
        console.error(e);
      }
}