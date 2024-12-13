const db = require("../config");
const Respuesta_evaluacion = db.respuesta_evaluacion;
const Evaluacion = db.evaluacion;
const Op = db.Sequelize.Op;

// Create and Save a new Respuesta_evaluacion
exports.create = (req, res) => {
      // Validate request
  


  // Create a Respuesta_evaluacion
  const respuesta_evaluacion = {
    evaluacionId: req.body.evaluacionId,
    pregunta_SoftwareId : req.body.pregunta_SoftwareId,
    opcionesId : req.body.opcionesId,
  };

  // Save Respuesta_evaluacion in the database
  Respuesta_evaluacion.create(respuesta_evaluacion)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Respuesta_evaluacion."
      });
    });
};

// Retrieve all Respuesta_evaluacions from the database.
exports.findAll = (req, res) => {
  

  Respuesta_evaluacion.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Respuesta_evaluacions."
      });
    });
};

// Find a single Respuesta_evaluacion with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Respuesta_evaluacion.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Respuesta_evaluacion with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Respuesta_evaluacion with id=" + id
      });
    });
};

// Update a Respuesta_evaluacion by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Respuesta_evaluacion.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Respuesta_evaluacion was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Respuesta_evaluacion with id=${id}. Maybe Respuesta_evaluacion was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Respuesta_evaluacion with id=" + id
      });
    });
};

// Delete a Respuesta_evaluacion with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
  Respuesta_evaluacion.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Respuesta_evaluacion was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Respuesta_evaluacion with id=${id}. Maybe Respuesta_evaluacion was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Respuesta_evaluacion with id=" + id
      });
    }); 
};

// Delete all Respuesta_evaluacions from the database.
exports.deleteAll = (req, res) => {
    db.Respuesta_evaluacion.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Respuesta_evaluacions were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Respuesta_evaluacions."
          });
        }); 
};



exports.findAreasById = (req, res) => {
  const solicitudId = req.params.id; // Assuming the solicitud ID is passed as a parameter

  Respuesta_evaluacion.findAll({
    where: {
      id_solicitud: solicitudId
    },
    //include: [{ model: db.solicitudes }] // Include the associated AreaEstudio model
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(">> Error while finding areas for solicitud: ", err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving areas for solicitud."
      });
    });
};


exports.deleteAreasBySolicitudId = (req, res) => {
  const solicitudId = req.params.id; // Assuming the solicitud ID is passed as a parameter

  Respuesta_evaluacion.destroy({
    where: {
      id_solicitud: solicitudId
    }
  })
    .then(numAffectedRows => {
      if (numAffectedRows > 0) {
        res.send({
          message: "Areas associated with the solicitud have been successfully deleted."
        });
      } else {
        res.send({
          message: "No areas found for the specified solicitud ID."
        });
      }
    })
    .catch(err => {
      console.log(">> Error while deleting areas for solicitud: ", err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting areas for solicitud."
      });
    });
};


exports.Respuestas = (req, res) => {

  const id = req.params.id;

  Respuesta_evaluacion.findAll({
    where: { evaluacionId: id },

    

    include: [
      {
        model: db.opciones,
        
        //where: { id: userId },
        include: [
          {
            model: db.pregunta_software,
            as: 'pregunta_software',
            
          },
    
        ],
      },

    ],
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving certificados."
      });
    });
}