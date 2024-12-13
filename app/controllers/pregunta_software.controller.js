const db = require("../config");
const Pregunta_software = db.pregunta_software;
const Opciones = db.opciones;
const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');


exports.create = (req, res) => {
  // Validate request
  if (!req.body.pregunta) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  if (!req.body.areaSoftwareId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Pregunta_software object
  const pregunta_software = {
    pregunta: req.body.pregunta,
    areaSoftwareId: req.body.areaSoftwareId,
    imagen: null // Set the default value to null
  };

  // Check if an image file was uploaded
  if (req.file) {
    const originalname = req.file.originalname; // Nombre original del archivo
    const extension = path.extname(originalname); // Extensión del archivo original
    const filename = originalname.replace(extension, ''); // Nombre de archivo sin extensión

    // Save the image file to a folder (e.g., 'uploads/')
    const imagePath = path.join('uploads', filename + extension); // Ruta de la imagen con el nombre y extensión
    req.file.path = imagePath;

    // Set the 'imagen' attribute of the Pregunta_software object to the image URL
    pregunta_software.imagen = imagePath;

    // Assign the filename to req.file.filename
    req.file.filename = filename + extension;
  }

  // Save Pregunta_software in the database
  Pregunta_software.create(pregunta_software)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Pregunta_software."
      });
    });
};



// Retrieve all Pregunta_softwares from the database.
exports.findAll = (req, res) => {
    const pregunta = req.query.pregunta;
  var condition = pregunta ? { pregunta: { [Op.iLike]: `%${pregunta}%` } } : null;

  Pregunta_software.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Pregunta_softwares."
      });
    });
};

// Find a single Pregunta_software with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Pregunta_software.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Pregunta_software with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Pregunta_software with id=" + id
      });
    });
};

// Update a Pregunta_software by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Pregunta_software.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Pregunta_software was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Pregunta_software with id=${id}. Maybe Pregunta_software was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Pregunta_software with id=" + id
      });
    });
};

// Delete a Pregunta_software with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Pregunta_software.findByPk(id)
    .then(pregunta => {
      if (pregunta) {
        // Eliminar el archivo de imagen asociado a la pregunta, si existe
        if (pregunta.imagen) {
          const imagePath = path.join('uploads/', pregunta.imagen);
          fs.unlink(imagePath, err => {
            if (err) {
              console.error(`Error al eliminar el archivo de imagen: ${err}`);
            } else {
              console.log(`Archivo de imagen eliminado: ${imagePath}`);
            }
          });
        }

        // Eliminar la pregunta de la base de datos
        Pregunta_software.destroy({
          where: { id: id }
        })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Pregunta_software was deleted successfully!"
              });
            } else {
              res.send({
                message: `Cannot delete Pregunta_software with id=${id}. Maybe Pregunta_software was not found!`
              });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Could not delete Pregunta_software with id=" + id
            });
          });
      } else {
        res.send({
          message: `Cannot delete Pregunta_software with id=${id}. Maybe Pregunta_software was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Pregunta_software with id=" + id
      });
    });
};



// Delete all Pregunta_softwares from the database.
exports.deleteAll = (req, res) => {
    Pregunta_software.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Pregunta_softwares were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Pregunta_softwares."
          });
        }); 
};

exports.findOpcionesById = (req, res) => {
  const preguntaSoftwareId = req.params.id;

  Opciones.findAll({
    where: {
      preguntaSoftwareId: preguntaSoftwareId
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






exports.findOneOpciones = (req, res) => {
  const id = req.params.id;

Pregunta_software.findAll({
  where:{id:id},
  include:[{
    model: Opciones,
    as: 'opciones',

}],


})
  .then(data => {
    

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Pregunta_software with id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Pregunta_software with id=" + id
    });
  });
};
