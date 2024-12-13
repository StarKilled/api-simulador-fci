module.exports = app => {
    const certificado = require("../controllers/certificado.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", certificado.create);
  
    // Retrieve all certificado
    //router.get("/", certificado.findAll);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", certificado.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", certificado.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", certificado.delete);
  
    // Create a new Tutorial
    router.delete("/", certificado.deleteAll);

    router.get("/:userId/certificados", certificado.findAllByUserId);
  
    router.get("/:id/evaluacion", certificado.findByEvaluacion);

    router.get("/:id/areas", certificado.findAreasEvaluacion);


    router.get("/:id/areas", certificado.findAreasEvaluacion);

    router.get("/:id/word", certificado.generarWord);


    router.get("/", certificado.todos)

    app.use('/api/certificado', router);
  };