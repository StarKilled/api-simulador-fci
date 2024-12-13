const nodemailer = require('nodemailer');
const { create } = require('../controllers/area_estudio.controller');

// Configura el transporte del correo electrónico
const createTreans = () => {
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {

        user: "4d027ad8e34277",
        pass: "7a08aff2581752"
      }


  // service: "gmail",
  // auth: {
  //   user: 'aalmeida6069@utm.edu.ec',
  //   pass: 'xxxxxxxx'
  // }

});
return transport;
}


function sendSolicitudAprobadoEmail(email, fecha_inicio, fecha_fin) {
  const transporter = createTreans()
  const mailOptions = transporter.sendMail( {
    from: 'suficienciafci@gmail.com',
    to: email,
    subject: 'Solicitud de Evaluación: Aprobada',
    html: `
    <h3>Estimado(a) Estudiante,</h3>
    <p>Esperamos que este mensaje le encuentre bien.</p>
    <p>Nos complace informarle que su solicitud de evaluación ha sido aprobada.</p>
    <p>Las fechas para su evaluación son las siguientes:</p>
    <ul>
      <li><strong>Fecha de inicio:</strong> ${fecha_inicio}</li>
      <li><strong>Fecha de fin:</strong> ${fecha_fin}</li>
    </ul>
    <p>Por favor, marque estas fechas en su calendario y prepárese de manera adecuada para la evaluación.</p>
    <p>Para ver su evaluacion, por favor haga clic en el siguiente enlace: 
         <a href="http://localhost:8081/evaluacion">Evaluacion</a>
      </p>
    <p>Si tiene alguna pregunta o necesita más ayuda con los temas, por favor no dude en contactarnos.</p>
    <p>Saludos cordiales,</p>
    <p>SuficienciaFCI</p>`
  });
}

function sendSolicitudRechazadoEmail(email) {
  const transporter = createTreans()
  const mailOptions = transporter.sendMail( {
    from: 'suficienciafci@gmail.com',
    to: email,
    subject: 'Solicitud de Evaluación: Rechazada',
    html: `
      <h3>Estimado(a) Estudiante,</h3>
      <p>Esperamos que este mensaje le encuentre bien.</p>
      <p>Lamentamos informarle que su solicitud de evaluación ha sido rechazada.</p>
      <p>Esto puede deberse a varios factores, como la disponibilidad del calendario de evaluaciones, requisitos previos no cumplidos, entre otros. Le recomendamos revisar los requisitos de las evaluaciones y volver a presentar su solicitud si es posible.</p>
      <p>Si tiene alguna pregunta o necesita más ayuda con los temas del curso, por favor no dude en contactarnos.</p>
      <p>Saludos cordiales,</p>
      <p>SuficienciaFCI</p>`
  });
}

function sendEvaluacionAprobadoEmail(email, nota) {
  const transporter = createTreans()
  const mailOptions = transporter.sendMail({
    from: 'suficienciafci@gmail.com',
    to: email,
    subject: 'Resultado de la Evaluación: Aprobado',
    html: `
      <h3>Estimado(a) Estudiante,</h3>
      <p>Esperamos que este mensaje le encuentre bien.</p>
      <p>¡Felicitaciones! Nos complace informarle que ha aprobado la evaluación con una puntuación de ${nota}.</p>
      <p>Continúe esforzándose y avanzando en sus estudios. Si tiene alguna pregunta o necesita más ayuda con los temas, no dude en contactarnos.</p>
      <p>Saludos cordiales,</p>
      <p>SuficienciaFCI</p>`
  });
}

function sendEvauacionFallidaEmail(email, nota) {
  const transporter = createTreans()
  const mailOptions = transporter.sendMail({
    from: 'suficienciafci@gmail.com',
    to: email,
    subject: 'Resultado de la Evaluación: No Aprobado',
    html: `
    <h3>Estimado(a) Estudiante,</h3>
    <p>Esperamos que este mensaje le encuentre bien.</p>
    <p>Lamentamos informarle que su evaluación no ha sido aprobada. Su puntuación fue de ${nota}.</p>
    <p>Le alentamos a repasar el material de los simulaciones y a prepararse para la próxima evaluación. Recuerde que el fracaso es solo una oportunidad para aprender y mejorar.</p>
    <p>Si tiene alguna pregunta o necesita más ayuda con los temas, por favor no dude en contactarnos.</p>
    <p>Saludos cordiales,</p>
    <p>SuficienciaFCI </p>`
  });
}

function sendEvauacionTiempoAgotadoEmail(email) {
  const transporter = createTreans()
  const mailOptions = transporter.sendMail({
    from: 'suficienciafci@gmail.com',
    to: email,
    subject: 'Evaluación: Tiempo Agotado',
    html: `
    <h3>Estimado(a) Estudiante e interesado,</h3>
    <p>Esperamos que este mensaje le encuentre bien.</p>
    <p>Lamentamos informarle que el tiempo para su evaluación ha finalizado y, por ende, no se ha registrado ninguna puntuación.</p>
    <p>Es crucial que administre su tiempo de manera eficaz durante las evaluaciones para evitar situaciones como esta en el futuro. Le alentamos a prepararse para la próxima evaluación y a estar consciente de los plazos establecidos.</p>
    <p>Si tiene alguna pregunta o necesita más ayuda con los temas o con técnicas de manejo del tiempo, por favor no dude en contactarnos.</p>
    <p>Saludos cordiales,</p>
    <p>SuficienciaFCI</p>`
  });
}

function sendConfirmationEmail(email) {
  const transporter = createTreans();
  const mailOptions = transporter.sendMail({
    from: 'suficienciafci@gmail.com',
    to: email,
    subject: 'Registro completado',
    html: `
      <h3>Estimado(a) Estudiante e interesado,</h3>
      <p>Esperamos que este mensaje le encuentre bien.</p>
      <p>Nos complace informarle que su registro se ha completado con éxito.</p>
      <p>Ahora tiene acceso completo a todos los recursos y beneficios disponibles para nuestros estudiantes e interesados registrados. Le animamos a explorar y a aprovechar al máximo estas oportunidades.</p>
      <p>Si tiene alguna pregunta o necesita más ayuda con los temas del curso, por favor no dude en contactarnos.</p>
      <p>Saludos cordiales,</p>
      <p>SuficienciaFCI</p>`
  });
}



function sendPasswordResetEmail(email, resetToken) {

  const resetLink = `http://localhost:8080/api/auth/user/reset-password?token=${resetToken}`;
  const transporter = createTreans();
  const mailOptions = transporter.sendMail({
    from: "noreply@example.com",
    to: email,
    subject: "Password Reset",
    text: `You have requested to reset your password. Please click the following link to reset your password: ${resetLink}`,
  });
}

module.exports = {
  sendPasswordResetEmail,
  sendSolicitudAprobadoEmail,
  sendSolicitudRechazadoEmail,
  sendEvaluacionAprobadoEmail,
  sendEvauacionFallidaEmail,
  sendEvauacionTiempoAgotadoEmail,
  sendConfirmationEmail,
};



