//  const multer = require('../middleware/multerConfig');

// const preguntaController = require('../controllers/pregunta_software.controller');

// module.exports = (app) => {
//   const router = require('express').Router();

//   // Ruta para subir una imagen para una pregunta específica

//   // Resto de las rutas para pregunta_software
//   router.post('/', preguntaController.create);
//   router.get('/', preguntaController.findAll);
//   router.get('/:id', preguntaController.findOne);
//   router.put('/:id', preguntaController.update);
//   router.delete('/:id', preguntaController.delete);
//   router.get('/:id/opciones', preguntaController.findOpcionesById);
//   router.get('/:id/pregunta', preguntaController.findOneOpciones);

//   app.use('/api/pregunta_software', router);
// };


const multer = require('multer');
const preguntaController = require('../controllers/pregunta_software.controller');

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Configuración de Multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    // const uniqueFilename = uuidv4(); // Generar un UUIDv4 único
    // const extension = path.extname(file.originalname); // Extensión del archivo original
    // const filename = uniqueFilename + extension; // Nombre de archivo único

    const filename = file.originalname; // Utilizar el nombre original del archivo sin modificar

    cb(null, filename);
  }
});


const upload = multer({ storage: storage });



module.exports = (app) => {
  const router = require('express').Router();

  router.post(
    '/',
    upload.single('imagen'),
    preguntaController.create
  );

  router.get('/', preguntaController.findAll);
  router.get('/:id', preguntaController.findOne);
  router.put('/:id', preguntaController.update);
  router.delete('/:id', preguntaController.delete);
  router.get('/:id/opciones', preguntaController.findOpcionesById);
  router.get('/:id/pregunta', preguntaController.findOneOpciones);

  app.use('/api/pregunta_software', router);
};
