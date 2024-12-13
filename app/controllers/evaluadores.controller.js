const db = require("../config");
const Evaluadores = db.evaluadores;
const Op = db.Sequelize.Op;

// Create and Save a new evaluadores
exports.create = (req, res) => {
      // Validate request
  

  // Create a evaluadores
  const evaluadores = {
    
    userId: req.body.userId,
    activo: req.body.activo,
  };

  // Save evaluadores in the database
  Evaluadores.create(evaluadores)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the evaluadores."
      });
    });
};

// Retrieve all evaluadoress from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Evaluadores.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving evaluadoress."
      });
    });
};

// Find a single evaluadores with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

  Evaluadores.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find evaluadores with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving evaluadores with id=" + id
      });
    });
};

// Update a evaluadores by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Evaluadores.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "evaluadores was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update evaluadores with id=${id}. Maybe evaluadores was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating evaluadores with id=" + id
      });
    });
};

// Delete a evaluadores with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
  Evaluadores.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "evaluadores was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete evaluadores with id=${id}. Maybe evaluadores was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete evaluadores with id=" + id
      });
    }); 
};

// Delete all evaluadoress from the database.
exports.deleteAll = (req, res) => {
    Evaluadores.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} evaluadoress were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all evaluadoress."
          });
        }); 
};

exports.findByEvaluacion = (req, res) => {
  const id = req.params.id;

  db.user.findAll({
    //where: { evaluacionId: id },
          
    include: [
      {
        model: Evaluadores,
        as: 'evaluadores',
        where: { userID: id },
      },
    ],
    

  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving certificados for user with ID=" + id
      });
    });
};

exports.ListaEvaluadores = (req, res) => {
  const activo = req.query.activo;
  let condition = null;

  if (activo) {
    condition = { activo: { [Op.eq]: activo } };
  }

  Evaluadores.findAll({
    where: condition ,
    include: [
      {
        model: db.user,
        as:'user',
        // where: { userId: userId },
        
      }
    ]
  })
    .then(data => {
      
        res.send(data);

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error al mostrar la lista de evaluadores."
      });
    });
};


exports.EvaluadorActivo = (req, res) => {
  

  Evaluadores.findAll({
    where :{activo: 1},
    include: [
      {
        model: db.user,
        as:'user',
        // where: { userId: userId },
        
      }
    ]
  })
    .then(data => {
      
        res.send(data);

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error al mostrar la lista de evaluadores."
      });
    });
};