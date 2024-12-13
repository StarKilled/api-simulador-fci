const db = require("../config");
const Evaluacion = db.evaluacion;
const Solicitudes = db.solicitudes;
const Solicitud_area = db.solicitud_area;
const User = db.user;

const Op = db.Sequelize.Op;

// Create and Save a new evaluacion
exports.create = (req, res) => {
  // Validate request

  // Create a evaluacion
  const evaluacion = {
    solicitudeId: req.body.solicitudeId,
    nota: req.body.nota,
    fecha_inicio: req.body.fecha_inicio,
    fecha_fin: req.body.fecha_fin,
    estado_e: req.body.estado ? req.body.estado : "Pendiente"
  };

  // Save evaluacion in the database
  Evaluacion.create(evaluacion)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the evaluacion."
      });
    });
};

// Retrieve all evaluacions from the database.
exports.findAll = (req, res) => {
  const estado_e = req.query.estado_e;
  let condition = null;

  if (estado_e) {
    condition = { estado_e: { [Op.eq]: estado_e } };
  }

  Evaluacion.findAll({
    where: condition, include: [
      {
        model: Solicitudes,
        as: 'solicitudes',
        include: {
          model: User,
          as: 'user',
          attributes: ['nombres','apellidos','cedula'],
        }
      }
    ],
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving evaluacions."
      });
    });
};

// Find a single evaluacion with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Evaluacion.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find evaluacion with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving evaluacion with id=" + id
      });
    });
};

// Update a evaluacion by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Evaluacion.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "evaluacion was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update evaluacion with id=${id}. Maybe evaluacion was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating evaluacion with id=" + id
      });
    });
};

// Delete a evaluacion with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Evaluacion.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "evaluacion was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete evaluacion with id=${id}. Maybe evaluacion was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete evaluacion with id=" + id
      });
    });
};

// Delete all evaluacions from the database.
exports.deleteAll = (req, res) => {
  Evaluacion.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} evaluacions were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all evaluacions."
      });
    });
};

// exports.findAllByUserId = (req, res) => {
//   const userId = req.params.id;

//   Solicitudes.findAll({
//     where: { userId: userId },
//     include: [
//       {
//         model: Evaluacion,
//         as:'evaluacion'

//       }
//     ]
//   })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving evaluations for user with ID=" + userId
//       });
//     });
// };

exports.findAllByUserId = (req, res) => {
  const userId = req.params.id;

  Evaluacion.findAll({

    include: [
      {
        model: Solicitudes,
        as: 'solicitudes',
        where: { userId: userId },

      }
    ]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving evaluations for user with ID=" + userId
      });
    });
};

exports.findAllByUserIdPendientes = (req, res) => {
  const userId = req.params.id;

  Evaluacion.findAll({
    where: { estado_e: "Pendiente" },
    include: [
      {
        model: Solicitudes,
        as: 'solicitudes',
        where: { userId: userId },

      }
    ]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving evaluations for user with ID=" + userId
      });
    });
};

exports.checkPendingEvaluacion = (req, res) => {
  const userId = req.params.userId;

  Evaluacion.findOne({
    where: {
      estado_e: "Pendiente",
    },
    include: [
      {
        model: Solicitudes,
        as: 'solicitudes',
        where: { userId: userId },

      }
    ]
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




exports.findAreasEvaluacion = async (req, res) => {
  const id = req.params.id;
  let Solicitud_id;

  try {
    const evaluacion = await Evaluacion.findByPk(id);
    if (evaluacion) {
      Solicitud_id = evaluacion.solicitudeId;
    }
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving evaluacion with id=" + id,
    });
  }

  try {
    const data = await Solicitud_area.findAll({
      where: { id_solicitud: Solicitud_id },
    });
    const id_area_estudio = data.map(item => item.id_area_estudio);
    res.send(id_area_estudio);
  } catch (err) {
    console.log(">> Error while finding preguntas: ", err);
    res.status(500).send({
      message: "Some error occurred while retrieving preguntas.",
    });
  }
};

exports.findEvaluacionPendientes = (req, res) => {

  Evaluacion.findAll(
    { estado_e: "Pendiente" },

  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Ques"
      });
    });
};



exports.findByEvaluacion = (req, res) => {
  const id = req.params.id;

  Evaluacion.findAll({
    where: { id: id },

    include: [
      {
        model: Solicitudes,
        as: 'solicitudes',

        include: [
          {
            model: db.user,
            as: 'user',
            //where: { id: userId },
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
        message: "Error retrieving certificados for user with ID=" + id
      });
    });
};

exports.enviarConfirmacion = (req, res) => {
  const { email, fecha_inicio, fecha_fin } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      emailService.sendSolicitudAprobadoEmail(email, fecha_inicio, fecha_fin);

      res.status(200).send({ message: 'Confirmation email sent.' });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};