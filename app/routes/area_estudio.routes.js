module.exports = app => {
    const area_estudio = require("../controllers/area_estudio.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", area_estudio.create);
  
    // Retrieve all area_estudio
    router.get("/", area_estudio.findAll);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", area_estudio.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", area_estudio.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", area_estudio.delete);
  
    // Create a new Tutorial
    router.delete("/", area_estudio.deleteAll);
  
    router.get('/:id/area_software', area_estudio.findSoftwareById)

    router.get('/:id/preguntas', area_estudio.findPreguntasByAreaEstudioId)


    app.use('/api/area_estudio', router);
  };