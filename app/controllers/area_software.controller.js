const db = require("../config");
const Area_software = db.area_software;
const Op = db.Sequelize.Op;

// Create and Save a new Area_software
exports.create = (req, res) => {
      // Validate request
  if (!req.body.software) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  if (!req.body.areaEstudioId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }


  // Create a Area_software
  const area_software = {
    software: req.body.software,
    areaEstudioId : req.body.areaEstudioId,
  };

  // Save Area_software in the database
  Area_software.create(area_software)
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

// Retrieve all Area_softwares from the database.
exports.findAll = (req, res) => {
    const software = req.query.software;
  var condition = software ? { software: { [Op.iLike]: `%${software}%` } } : null;

  Area_software.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Area_softwares."
      });
    });
};

// Find a single Area_software with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Area_software.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Area_software with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Area_software with id=" + id
      });
    });
};

// Update a Area_software by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Area_software.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Area_software was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Area_software with id=${id}. Maybe Area_software was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Area_software with id=" + id
      });
    });
};

// Delete a Area_software with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
  Area_software.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Area_software was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Area_software with id=${id}. Maybe Area_software was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Area_software with id=" + id
      });
    }); 
};

// Delete all Area_softwares from the database.
exports.deleteAll = (req, res) => {
    Area_software.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Area_softwares were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Area_softwares."
          });
        }); 
};



