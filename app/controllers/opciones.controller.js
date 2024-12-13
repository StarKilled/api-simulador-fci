const db = require("../config");
const Opciones = db.opciones;
const Op = db.Sequelize.Op;

// Create and Save a new Opciones
exports.create = (req, res) => {
  // Validate request


// Create a Area_software
const opciones = {
opcion: req.body.opcion,
escorrecta: req.body.escorrecta,
preguntaSoftwareId : req.body.preguntaSoftwareId,
};

// Save Area_software in the database
Opciones.create(opciones)
.then(data => {
  res.send(data);
})
.catch(err => {
  res.status(500).send({
    message:
      err.message || "Some error occurred while creating the Area_software."
  });
});
};

// Retrieve all Opciones from the database.
exports.findAll = (req, res) => {
  const preguntaSoftwareId = req.query.preguntaSoftwareId;
  var condition = preguntaSoftwareId ? { preguntaSoftwareId: preguntaSoftwareId } : null;

  Opciones.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving opciones."
      });
    });
};

// Find a single Opciones with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Opciones.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Opciones with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Opciones with id=" + id
      });
    });
};

// Update a Opciones by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Opciones.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Opciones was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Opciones with id=${id}. Maybe Opciones was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Opciones with id=" + id
      });
    });
};

// Delete a Opciones with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Opciones.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Opciones was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Opciones with id=${id}. Maybe Opciones was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Opciones with id"
      });
    });
};
