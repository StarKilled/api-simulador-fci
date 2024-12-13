const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require('node-cron');
const moment = require('moment');


// Continúa con el resto de tu código...


const { sendEvauacionTiempoAgotadoEmail } = require("./app/middleware/emailService");



const app = express();



// var corsOptions = {
//   origin: "https://victorious-cliff-0473df610.3.azurestaticapps.net"
// };

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


const db = require("./app/config");
const Role = db.role;
const Tipo_evaluacion = db.tipo_evaluacion;

const Evaluacion = db.evaluacion;
const User = db.user;

//Reniciar todo

// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });


db.sequelize.sync()
  .then(async () => {
    console.log("Synced db.");

    // Obtener las evaluaciones pendientes al iniciar el servidor
    const evaluations = await Evaluacion.findAll({
      where: { estado_e: 'Pendiente' },
      include: [
        {
          model: db.solicitudes,
          as: 'solicitudes',
          include: [
            {
              model: db.user,
              as: 'user',
            },
          ],
        },
      ],
    });

    // Comienza aquí el nuevo código
    for (const evaluation of evaluations) {
      if (!evaluation.fecha_fin) {
        console.log('Skipping evaluation with ID ', evaluation.id, ' because it has no fecha_fin');
        continue;
      }

      // Resto del código anterior...

      const end = moment(evaluation.fecha_fin).endOf('day');
      const nextDay = end.add(1, 'minute');
      const now = moment();
      const duration = moment.duration(nextDay.diff(now));
      const seconds = duration.asSeconds();

      if (isNaN(seconds)) {
        console.error('Error: NaN seconds for evaluation ID ', evaluation.id);
      } else {
        cron.schedule('5 0 * * *', async () => {
          // Obtén el email del usuario relacionado con la evaluación
          const email = evaluation.solicitudes.user.email;

          // Llama a tu función para enviar el correo
          sendEvauacionTiempoAgotadoEmail(email);

          // Actualiza el estado de la evaluación a "Suspenso"
          evaluation.estado_e = 'Suspenso';
          await evaluation.save();

          const solicitud = await db.solicitudes.findOne({ where: { id: evaluation.solicitudeId } });
          if (solicitud) {
            solicitud.estado = 'Finalizado';
            await solicitud.save();
          }
        });
      }
    }
    // Termina aquí el nuevo código

  })
  .catch((err) => {
    console.log("Failed to sync db:", err);
  });



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Servidor de BACKEND SuficienciaFCI" });
});


// routes
app.use('/api/uploads', express.static('uploads'));


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

require('./app/routes/usercrud.routes')(app);

require('./app/routes/area_estudio.routes')(app);
require('./app/routes/area_software.routes')(app);
require('./app/routes/pregunta_software.routes')(app);
require('./app/routes/evaluadores.routes')(app);
require('./app/routes/evaluacion.routes')(app);
require('./app/routes/respuesta_evaluacion.routes')(app);
require('./app/routes/tipo_evaluacion.routes')(app);
require('./app/routes/certificado.routes')(app);
require('./app/routes/opciones.routes')(app);
require('./app/routes/solicitudes.routes')(app);
require('./app/routes/solicitud_area.routes')(app);


//app.use(uploadRoutes);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "docente"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
  Role.create({
    id: 4,
    name: "certificador"
  });
  Tipo_evaluacion.create({
    id: 1,
    naturaleza: "Estudiante"
  })
  Tipo_evaluacion.create({
    id: 2,
    naturaleza: "Concurso docencia"
  })
}

//-----------------------------------------------------------------------------

