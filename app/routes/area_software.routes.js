module.exports = app => {
    const area_software = require("../controllers/area_software.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", area_software.create);
  
    // Retrieve all area_software
    router.get("/", area_software.findAll);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", area_software.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", area_software.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", area_software.delete);
  
    // Create a new Tutorial
    router.delete("/", area_software.deleteAll);

    
  
    app.use('/api/area_software', router);
  };