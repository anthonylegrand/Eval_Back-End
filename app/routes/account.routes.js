const controller = require("../controllers/account.controller.js");
const router = require("express").Router();

module.exports = function(app) {
    
    // Auth with {pseudo, password}
    router.get("/:compteID", controller.getAll);

    // Auth with {pseudo, password}
    router.post("/login", controller.login);

    app.use('/account', router);
}