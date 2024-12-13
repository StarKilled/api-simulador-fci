module.exports = app => {
    const opciones = require("../controllers/opciones.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", opciones.create);
  
    // Retrieve all opciones
    router.get("/", opciones.findAll);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", opciones.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", opciones.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", opciones.delete);
  
    app.use('/api/opciones', router);
  };