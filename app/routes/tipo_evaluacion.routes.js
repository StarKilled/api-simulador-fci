module.exports = app => {
    const tipo_evaluacion = require("../controllers/tipo_evaluacion.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", tipo_evaluacion.create);
  
    // Retrieve all tipo_evaluacion
    router.get("/", tipo_evaluacion.findAll);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", tipo_evaluacion.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", tipo_evaluacion.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", tipo_evaluacion.delete);
  
    // Create a new Tutorial
    router.delete("/", tipo_evaluacion.deleteAll);
  
    app.use('/api/tipo_evaluacion', router);
  };