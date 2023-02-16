require('dotenv').config()
const mongoose = require('mongoose');

const Perssonage = require('./../database/models/perssonage.model')

exports.get = async (req, res, next) => {
    const { pseudo, classe } = req.params

    let perssonage = await alreadyExisted({ pseudo, classe })
    if(perssonage){
        res.status(200).json(perssonage);
    }else{
        res.status(400).json({error: "Le [Pseudo / Classe] n'existe pas !"})
    }
}

exports.update = async (req, res, next) => {
    const { pseudo, classe, newpseudo, newClasse, niveau } = req.body

    if(!process.env.CLASSES_LIST.split(', ').includes(newClasse))
        return res.status(400).json({error: `La classe '${newClasse}' n'existe pas !`})

    if(await alreadyExisted({ pseudo: newpseudo || pseudo, classe: newClasse || classe }))
        return res.status(400).json({error: `Un perssonage existe déjà avec le pseudo '${newpseudo || pseudo}' et la classe ${newClasse || classe} !`})
        
    try {
        let filter = {pseudo, classe}
        if(!req.token)
            filter.compteID = req.compteID

        const perssonage = await mongoose.model('perssonage').updateOne(filter, {
            pseudo: newpseudo || pseudo,
            classe: newClasse || classe,
            niveau
        });
        
        if(perssonage.modifiedCount === 1)
            res.status(200).json(await alreadyExisted({ pseudo: newpseudo || pseudo, classe: newClasse || classe }));
        else
            res.status(400).json({error: "Le [Pseudo / Classe] n'existe pas !"})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: "Une erreur interne est survenue"})
    }
}

exports.create = async (req, res, next) => {
    if(req?.token)
        res.status(405).json({ error: 'Les Admins ne peuvent pas accéder à cette route' })

    try {
        if(!await alreadyExisted(req.body)){
            let perssonage = new Perssonage()
            perssonage.compteID = req.compteID
            perssonage.pseudo = req.body.pseudo
            perssonage.classe = req.body.classe
            perssonage.save()

            res.status(201).json(perssonage);
        }else{
            res.status(400).json({error: "Le [Pseudo / Classe] existe déjà !"});
        }
    } catch (err) {
        res.status(400).json({error: "Impossible de créer ce perssonage"});
    }
}

exports.delete = async (req, res, next) => {
    const {pseudo, classe} = req.body
    mongoose.model('perssonage').findOneAndDelete({pseudo, classe}, (err) => {
        if(err) res.status(400).json({error: "Impossible de supprimer ce perssonage"});
        res.status(200).json({ result: "Perssonage supprimé avec succée" });
    });
}

function alreadyExisted({pseudo, classe}){
    return new Promise(resolve => {
        mongoose.model('perssonage').findOne({pseudo, classe}, (err, doc) => {
            if(doc)
                resolve(doc)
            else
                resolve(null)
        })
    })
}