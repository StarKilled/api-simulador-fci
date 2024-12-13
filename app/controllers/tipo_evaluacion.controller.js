const db = require("../config");
const Tipo_evaluacion = db.tipo_evaluacion;
const Op = db.Sequelize.Op;

// Create and Save a new Tipo_evaluacion
exports.create = (req, res) => {
      // Validate request



  // Create a Tipo_evaluacion
  const tipo_evaluacion = {
    software: req.body.software,
    areaEstudioId : req.body.areaEstudioId,
  };

  // Save Tipo_evaluacion in the database
  Tipo_evaluacion.create(tipo_evaluacion)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tipo_evaluacion."
      });
    });
};

// Retrieve all Tipo_evaluacions from the database.
exports.findAll = (req, res) => {
    const software = req.query.software;
  var condition = software ? { software: { [Op.iLike]: `%${software}%` } } : null;

  Tipo_evaluacion.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Tipo_evaluacions."
      });
    });
};

// Find a single Tipo_evaluacion with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Tipo_evaluacion.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tipo_evaluacion with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tipo_evaluacion with id=" + id
      });
    });
};

// Update a Tipo_evaluacion by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tipo_evaluacion.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tipo_evaluacion was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Tipo_evaluacion with id=${id}. Maybe Tipo_evaluacion was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tipo_evaluacion with id=" + id
      });
    });
};

// Delete a Tipo_evaluacion with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
  Tipo_evaluacion.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tipo_evaluacion was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tipo_evaluacion with id=${id}. Maybe Tipo_evaluacion was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tipo_evaluacion with id=" + id
      });
    }); 
};

// Delete all Tipo_evaluacions from the database.
exports.deleteAll = (req, res) => {
    Tipo_evaluacion.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Tipo_evaluacions were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Tipo_evaluacions."
          });
        }); 
};



