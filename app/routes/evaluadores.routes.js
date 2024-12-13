module.exports = app => {
    const evaluadores = require("../controllers/evaluadores.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", evaluadores.create);
  
    // Retrieve all evaluadores
    router.get("/", evaluadores.ListaEvaluadores);
 
    // Retrieve a single Tutorial with id
    router.get("/:id", evaluadores.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", evaluadores.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", evaluadores.delete);
  
    // Create a new Tutorial
    router.delete("/", evaluadores.deleteAll);

    router.get("/lista/a", evaluadores.ListaEvaluadores);


    router.get("/activo/user", evaluadores.EvaluadorActivo);

  

    
    app.use('/api/evaluadores', router);
  };