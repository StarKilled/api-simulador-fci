module.exports = app => {
    const evaluacion = require("../controllers/evaluacion.controller.js");
  
    var router = require("express").Router();

    


    router.post("/", evaluacion.create);


  
    // Retrieve all evaluacion
    router.get("/", evaluacion.findAll);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", evaluacion.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", evaluacion.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", evaluacion.delete);
  
    // Create a new Tutorial
    router.delete("/", evaluacion.deleteAll);
  
    router.get("/:id/user", evaluacion.findAllByUserId);


    router.get("/:userId/estado", evaluacion.checkPendingEvaluacion);

    router.get("/:id/pendientes", evaluacion.findAllByUserIdPendientes);

    router.get("/:id/areas", evaluacion.findAreasEvaluacion);

    router.get("/:id/id", evaluacion.findByEvaluacion);

    router.post("/aceptacion/email", evaluacion.enviarConfirmacion);

    app.use('/api/evaluacion', router);
  };