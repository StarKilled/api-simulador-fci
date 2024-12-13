const db = require("../config");
const Area_estudio= db.area_estudio;
const Area_software = db.area_software;
const Pregunta_software = db.pregunta_software;
const Opciones = db.opciones;
const Op = db.Sequelize.Op;

// Create and Save a new 
exports.create = (req, res) => {
      // Validate request
  if (!req.body.area) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a area_estudio  
  const area_estudio = {
    area: req.body.area
  };

  // Save area_estudio in the database
  Area_estudio.create(area_estudio)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the area_estudio"
      });
    });
};

// Retrieve all area_estudio from the database.
exports.findAll = (req, res) => {
  const area = req.query.area;
  var condition = area ? { area: { [Op.iLike]: `%${area}%` } } : null;

  Area_estudio.findAll({ 
    where: condition,
    attributes: ['id', 'area'] // Agregar este objeto con las columnas deseadas
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving area_estudio."
      });
    });
};


// Find a single area_estudiowith an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Area_estudio.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find area_estudiowith id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving area_estudiowith id=" + id
      });
    });
};

// Update a area_estudioby the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Area_estudio.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "area_estudiowas updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update area_estudiowith id=${id}. Maybe area_estudiowas not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating area_estudiowith id=" + id
      });
    });
};

// Delete a area_estudiowith the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
  Area_estudio.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "area_estudiowas deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete area_estudiowith id=${id}. Maybe area_estudiowas not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete area_estudiowith id=" + id
      });
    }); 
};

// Delete all area_estudio from the database.
exports.deleteAll = (req, res) => {
    Area_estudio.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} area_estudio were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all area_estudio."
          });
        }); 
};

exports.findSoftwareById = (req, res) => {
  const areaEstudioId = req.params.id;

  Area_software.findAll({
    where: {
      areaEstudioId: areaEstudioId
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    console.log(">> Error while finding area software: ", err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving area software."
    });
  });
};

exports.findPreguntasByAreaEstudioId = (req, res) => {
  const areaEstudioId = req.params.id;

  Pregunta_software.findAll({
    include: [
      {
        model: Area_software,
        as: 'area_software',
        where: { areaEstudioId: areaEstudioId },
        include: [
          {
            model: Area_estudio,
            as: 'area_estudio',
            where: { id: areaEstudioId },
          },
        ],
      },
      {
        model: Opciones,
        as: 'opciones',
        required: false,
      },
    ],
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    console.log(">> Error while finding preguntas: ", err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving preguntas."
    });
  });
};
