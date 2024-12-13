module.exports = app => {
    const solicitudes = require("../controllers/solicitudes.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", solicitudes.create);
  
    // Retrieve all solicitudes
    router.get("/", solicitudes.findAll);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", solicitudes.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", solicitudes.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", solicitudes.delete);
  
    // Create a new Tutorial
    router.delete("/", solicitudes.deleteAll);

    router.get("/:userId/estado", solicitudes.checkPendingSolicitud);

  
    app.use('/api/solicitudes', router);
  };