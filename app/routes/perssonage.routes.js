const controller = require("../controllers/perssonage.controller.js");
const middleware = require("./../middleware/auth.middleware")
const router = require("express").Router();

module.exports = function(app) {
    
    // Get perssonage with {pseudo, classe}
    router.get("/:pseudo/:classe", controller.get);

    // Update perssonage with {pseudo, classe}
    // Need Auth - Bypass Admin
    router.put("/", [middleware.auth], controller.update);

    // Create new Perssonage {pseudo, classe}
    // Need Auth - No Admin
    router.post("/", [middleware.auth], controller.create);
    
    // Delete Perssonage {pseudo, classe}
    // Need Auth
    router.delete("/", [middleware.auth], controller.delete);

    app.use('/perssonage', router);
}