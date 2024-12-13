const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const authJwt = require("../middleware/authJwt");
const emailService = require("../middleware/emailService");



module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/refreshtoken", controller.refreshToken);

  app.post("/api/auth/user/forgot-password", controller.forgotPassword);
  app.post("/api/auth/user/reset-password", controller.resetPassword);



  app.post("/api/auth/user/send-confirmation-email", controller.sendConfirmationEmail);

  app.post("/api/auth/user/send-Solicitud-Aprobado", controller.enviarSolicitudConfirmada);

  app.post("/api/auth/user/send-Solicitud-Rechazado", controller.enviarSolicitudRechazada);

  app.post("/api/auth/user/send-Evaluacion-Aprobado", controller.enviarEvaluacionAprovado);

  app.post("/api/auth/user/send-Evaluacion-Fallida", controller.enviarEvaluacionFallida);

  app.post("/api/auth/user/send-Evaluacion-Agotado", controller.enviarEvaluacionAgotado);


  // app.get("/api/auth/user/verify-account/:token", controller.verifyAccount);

};