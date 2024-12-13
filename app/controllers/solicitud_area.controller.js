const db = require("../config");
const Solicitud_area = db.solicitud_area;
const Area_estudio = db.area_estudio;
const Op = db.Sequelize.Op;

// Create and Save a new solicitud_area
exports.create = (req, res) => {
      // Validate request
  


  // Create a solicitud_area
  const solicitud_area = {
    id_solicitud: req.body.id_solicitud,
    id_area_estudio : req.body.id_area_estudio,
  };

  // Save solicitud_area in the database
  Solicitud_area.create(solicitud_area)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the solicitud_area."
      });
    });
};

// Retrieve all solicitud_areas from the database.
exports.findAll = (req, res) => {
  

  Solicitud_area.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving solicitud_areas."
      });
    });
};

// Find a single solicitud_area with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Solicitud_area.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find solicitud_area with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving solicitud_area with id=" + id
      });
    });
};

// Update a solicitud_area by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Solicitud_area.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "solicitud_area was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update solicitud_area with id=${id}. Maybe solicitud_area was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating solicitud_area with id=" + id
      });
    });
};

// Delete a solicitud_area with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
  Solicitud_area.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "solicitud_area was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete solicitud_area with id=${id}. Maybe solicitud_area was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete solicitud_area with id=" + id
      });
    }); 
};

// Delete all solicitud_areas from the database.
exports.deleteAll = (req, res) => {
    db.solicitud_area.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} solicitud_areas were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all solicitud_areas."
          });
        }); 
};



exports.findAreasById = (req, res) => {
  const solicitudId = req.params.id; // Assuming the solicitud ID is passed as a parameter

  Solicitud_area.findAll({
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

  Solicitud_area.destroy({
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


exports.findAreasById2 = (req, res) => {
  const solicitudId = req.params.id; // Assuming the solicitud ID is passed as a parameter

  Area_estudio.findAll({
    include:[
      {
        model: Solicitud_area,
        as: 'solicitud_area',
        where: { solicitudId: solicitudId },
      },

    ]

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