module.exports = app => {
    const respuesta_evaluacion = require("../controllers/respuesta_evaluacion.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", respuesta_evaluacion.create);
  
    // Retrieve all respuesta_evaluacion
    router.get("/", respuesta_evaluacion.findAll);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", respuesta_evaluacion.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", respuesta_evaluacion.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", respuesta_evaluacion.delete);
  
    // Create a new Tutorial
    router.delete("/", respuesta_evaluacion.deleteAll);

    router.get("/:id/respuesta", respuesta_evaluacion.Respuestas);

  
    app.use('/api/respuesta_evaluacion', router);
  };