const db = require("../config");
const Certificado = db.certificado;
const Solicitudes = db.solicitudes;
const Evaluacion = db.evaluacion;
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new certificado
exports.create = (req, res) => {
  // Validate request

  // Create a certificado
  const certificado = {

    evaluacionId: req.body.evaluacionId,
    evaluadoreId: req.body.evaluadoreId,
    fecha_emision: req.body.fecha_emision,
    codigo_certificado: req.body.codigo_certificado,
    descargado: 0
  };

  // Save certificado in the database
  Certificado.create(certificado)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the certificado."
      });
    });
};

// Retrieve all certificados from the database.
exports.findAll = (req, res) => {



  Certificado.findAll({})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving certificados."
      });
    });
};

// Find a single certificado with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Certificado.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find certificado with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving certificado with id=" + id
      });
    });
};

// Update a certificado by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Certificado.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "certificado was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update certificado with id=${id}. Maybe certificado was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating certificado with id=" + id
      });
    });
};

// Delete a certificado with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Certificado.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "certificado was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete certificado with id=${id}. Maybe certificado was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete certificado with id=" + id
      });
    });
};

// Delete all certificados from the database.
exports.deleteAll = (req, res) => {
  Certificado.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} certificados were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all certificados."
      });
    });
};

exports.findAllByUserId = (req, res) => {
  const userId = req.params.userId;

  Certificado.findAll({

    include: [
      {
        model: Evaluacion,
        as: 'evaluacion',
        //where: { userId: userId },
        include: [
          {
            model: Solicitudes,
            as: 'solicitudes',
            where: { userId: userId },
          },
        ],
      }
    ]

  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving certificados for user with ID=" + userId
      });
    });
};


exports.findAllByUserId = (req, res) => {
  const userId = req.params.userId;

  Certificado.findAll({
    include: [
      {
        model: Evaluacion,
        as: 'evaluacion',
        include: [
          {
            model: Solicitudes,
            as: 'solicitudes',
            include: [
              {
                model: User,
                as: 'user',
                where: { id: userId },
              },
            ],
          },
        ],
      },
    ],
    where: {
      '$evaluacion.solicitudes.user.id$': userId,
    },
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al recuperar los certificados para el usuario con ID=" + userId
      });
    });
};




exports.findByEvaluacion = (req, res) => {
  const id = req.params.id;

  Certificado.findAll({
    where: { evaluacionId: id },
    include: [
      {
        model: Evaluacion,
        as: 'evaluacion',

        include: [
          {
            model: Solicitudes,
            as: 'solicitudes',

            include: [
              {
                model: User,
                as: 'user',
                //where: { id: userId },
              },

            ],
          },

        ],

      },

    ]

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

exports.findAreasEvaluacion = async (req, res) => {
  const id = req.params.id;
  let Solicitud_id;
  let id_area_estudio; // Mover la declaración aquí

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
    const data = await db.solicitud_area.findAll({
      where: { id_solicitud: Solicitud_id },
    });
    id_area_estudio = data.map(item => item.id_area_estudio); // Asignar los valores aquí
    //res.send(id_area_estudio);
  } catch (err) {
    console.log(">> Error while finding preguntas: ", err);
    res.status(500).send({
      message: "Some error occurred while retrieving preguntas.",
    });
  }

  try {
    const data = await db.area_estudio.findAll({
      where: { id: id_area_estudio },
    });
    const areas = data.map(item => item.area);
    res.send(areas);

  } catch (err) {
    return res.status(500).send({
      message: "Error Areas =" + id,
    });
  }
};

exports.findAreasEvaluacion2 = async (req) => {
  const id = req.params.id;
  let Solicitud_id;
  let id_area_estudio;

  try {
    const evaluacion = await Evaluacion.findByPk(id);
    if (evaluacion) {
      Solicitud_id = evaluacion.solicitudeId;
    }
  } catch (err) {
    console.log("Error retrieving evaluacion with id=" + id);
    return []; // Devuelve un array vacío en caso de error
  }

  try {
    const data = await db.solicitud_area.findAll({
      where: { id_solicitud: Solicitud_id },
    });
    id_area_estudio = data.map(item => item.id_area_estudio);
    console.log("id_area_estudio: ", id_area_estudio); // Añadir consola
  } catch (err) {
    console.log("Error while finding preguntas: ", err);
    return []; // Devuelve un array vacío en caso de error
  }

  try {
    const data = await db.area_estudio.findAll({
      where: { id: id_area_estudio },
    });
    const areas = data.map(item => item.area);
    console.log("areas: ", areas); // Añadir consola
    return areas;
  } catch (err) {
    console.log("Error Areas =" + id);
    return []; // Devuelve un array vacío en caso de error
  }
};


exports.todos = (req, res) => {

  //const userId = req.params.userId;

  Certificado.findAll({
    include: [
      {
        model: Evaluacion,
        as: 'evaluacion',
        include: [
          {
            model: Solicitudes,
            as: 'solicitudes',
            include: [
              {
                model: User,
                as: 'user',
              },
            ],
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

const Solicitud = db.solicitudes;

const PizZip = require('pizzip');




exports.generarWord = async (req, res) => {

  const certificado = await Certificado.findOne({
    where: { evaluacionId: req.params.id },
    include: [
      {
        model: Evaluacion,
        as: 'evaluacion',
        include: [
          {
            model: Solicitudes,
            as: 'solicitudes',
            include: [
              {
                model: User,
                as: 'user',
              },
            ],
          },
        ],
      },
    ],
  });

  if (!certificado) {
    return res.status(404).send({ message: 'Certificado no encontrado.' });
  }

  let areas = await this.findAreasEvaluacion2(req, res);
  areas = areas.join(", ");

  let fecha_emision = new Date(certificado.fecha_emision); // Asegúrate de que esto sea un objeto de fecha

  let fecha_expiracion = new Date(certificado.fecha_emision);
  fecha_expiracion.setMonth(fecha_expiracion.getMonth() + 6); // Añadir 6 meses a la fecha de emisión

  let fecha_actual = new Date();
  let opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  let formatoFecha = new Intl.DateTimeFormat('es-ES', opciones);
  let fecha_actual_formateada = formatoFecha.format(fecha_actual);

  let fecha_expiracion_formateada = formatoFecha.format(fecha_expiracion);

  let fecha_emision_formateada = formatoFecha.format(fecha_emision);

  const QRCode = require('qrcode')
  const ImageModule = require('docxtemplater-image-module-free');


  let dataToEncode = certificado.codigo_certificado + ' ' + certificado.fecha_emision;
  const qrPath = './Qr/image.png';

  await QRCode.toFile(qrPath, dataToEncode, {
    color: {
      dark: '#000',  // Black dots
      light: '#0000' // Transparent background
    }
  });



  let opts = {}
  opts.centered = false;
  opts.getImage = function (tagValue, tagName) {
    return fs.readFileSync(tagValue);
  }
  opts.getSize = function (img, tagValue, tagName) {
    return [100, 100];
  }

  var imageModule = new ImageModule(opts);

  var content = fs.readFileSync("./plantillas/Certificado3.docx", "binary");
  var zip = new PizZip(content);
  var doc = new docxtemplater(zip, { modules: [imageModule] });

  doc.setData({
    codigo_certificado: certificado.codigo_certificado,
    nombres: certificado.evaluacion.solicitudes.user.nombres,
    apellidos: certificado.evaluacion.solicitudes.user.apellidos,
    cedula: certificado.evaluacion.solicitudes.user.cedula,
    nota: certificado.evaluacion.nota,
    areas: areas,
    fecha_emision: fecha_emision_formateada,
    fecha_expiracion: fecha_expiracion_formateada,
    fecha_actual: fecha_actual_formateada,
    qr: qrPath, // Añade esto a la plantilla
  });

  try {
    doc.render()
  }
  catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Error al generar el certificado.' });
  }


  // Generar y guardar el archivo Word en un directorio temporal
  const tempFilePath = './temp/temp.docx';
  const buffer = doc.getZip().generate({ type: "nodebuffer" });
  fs.writeFileSync(tempFilePath, buffer);



  res.setHeader('Content-Disposition', 'inline; filename=output.docx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.send(buffer);



};

const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const docxtemplater = require('docxtemplater');

