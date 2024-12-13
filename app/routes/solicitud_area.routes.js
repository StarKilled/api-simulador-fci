module.exports = app => {
    const solicitud_area = require("../controllers/solicitud_area.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", solicitud_area.create);
  
    // Retrieve all solicitud_area
    router.get("/", solicitud_area.findAll);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", solicitud_area.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", solicitud_area.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", solicitud_area.delete);
  
    // Create a new Tutorial
    router.delete("/", solicitud_area.deleteAll);

    router.get('/:id/areas', solicitud_area.findAreasById)

    router.delete("/:id/areas", solicitud_area.deleteAreasBySolicitudId);

    router.get('/:id/area', solicitud_area.findAreasById2)

    app.use('/api/solicitud-area', router);
  };