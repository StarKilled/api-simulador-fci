const db = require("../config");
const Solicitudes = db.solicitudes;
const Area_estudio = db.area_estudio;
const Solicitud_area = db.solicitud_area;
const Op = db.Sequelize.Op;

const emailService = require("../middleware/emailService");


// Create and Save a new solicitudes
exports.create = (req, res) => {
  // Validate request
  if (!req.body.userId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a solicitudes
  const solicitudesData = {
    userId: req.body.userId,
    tipoEvaluacionId: req.body.tipoEvaluacionId,
    fecha_solicitud: req.body.fecha_solicitud,
    estado: req.body.estado ? req.body.estado : "Pendiente",
    comentario: req.body.comentario,
  };

  Solicitudes.create(solicitudesData)
 
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the solicitudes."
      });
    });
};


exports.findAll = (req, res) => {
  const estado = req.query.estado;
  let condition = null;

  if (estado) {
    condition = { estado: { [Op.eq]: estado } };
  }

  Solicitudes.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Solicitudes."
      });
    });
};


// Find a single Solicitudes with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

Solicitudes.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Solicitudes with id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Solicitudes with id=" + id
    });
  });
};


// Update a solicitudes by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Solicitudes.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "solicitudes was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update solicitudes with id=${id}. Maybe solicitudes was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating solicitudes with id=" + id
      });
    });
};

// Delete a solicitudes with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
  Solicitudes.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "solicitudes was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete solicitudes with id=${id}. Maybe solicitudes was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete solicitudes with id=" + id
      });
    }); 
};

// Delete all solicitudess from the database.
exports.deleteAll = (req, res) => {
    Solicitudes.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} solicitudess were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all solicitudess."
          });
        }); 
};

exports.findAllByUserId = (req, res) => {
  const userId = req.params.userId;

  Solicitudes.findAll({ where: { userId: userId } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving solicitudes."
      });
    });
};

exports.checkPendingSolicitud = (req, res) => {
  const userId = req.params.userId;

  Solicitudes.findOne({
    where: {
      userId: userId,
      estado: "Pendiente"
    }
  })
    .then(data => {
      if (data) {
        res.send({ hasPendingSolicitud: true });
      } else {
        res.send({ hasPendingSolicitud: false });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while checking the pending solicitud."
      });
    });
};
