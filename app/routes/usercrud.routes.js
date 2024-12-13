module.exports = app => {
    const user = require("../controllers/usercrud.controller.js");
  
    var router = require("express").Router();

  
    // Retrieve all user
    router.get("/", user.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", user.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", user.update);

    router.put("/:id/password", user.updateHash);

  
    // Delete a Tutorial with id
    router.delete("/:id", user.delete);
  
    app.use('/api/user', router);
  };