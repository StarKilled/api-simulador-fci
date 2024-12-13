const db = require("../config");
const config = require("../config/auth.config");

const emailService = require("../middleware/emailService");



const Op = db.Sequelize.Op;

const { user: User, role: Role, refreshToken: RefreshToken } = db;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    cedula: req.body.cedula,
    telefono: req.body.telefono,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),

  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
             emailService.sendConfirmationEmail(req.body.email)
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
          emailService.sendConfirmationEmail(req.body.email)

        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      [Op.or]: [
        { username: req.body.usernameOrEmail },
        { email: req.body.usernameOrEmail }
      ]
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    console.log(refreshToken)

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};


exports.changePassword = (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  // Aquí debes implementar la lógica para verificar la antigua contraseña,
  // actualizarla en la base de datos y devolver una respuesta adecuada.

  // Ejemplo de implementación básica:
  User.findByPk(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);

      // Dentro del controlador del cambio de contraseña
if (!passwordIsValid) {
  return res.status(401).send({
    message: "Ingreso de la contraseña antigua incorrecta, intente de nuevo."
  });
}


      user.password = bcrypt.hashSync(newPassword, 8);
      user.save();

      res.status(200).send({ message: "Cambio de contraseña realizado!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


const crypto = require('crypto');


function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Controlador de autenticación - Código adicional
// Código existente...

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const resetToken = generateResetToken();
      user.resetToken = resetToken;
      user.save();

      emailService.sendPasswordResetEmail(user.email, resetToken);

      res.status(200).send({ message: "Password reset email sent successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetPassword = (req, res) => {
  const { resetToken, newPassword } = req.body;

  User.findOne({ where: { resetToken } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      // Actualizar la contraseña y restablecer el token
      user.password = bcrypt.hashSync(newPassword, 8);
      user.resetToken = null;
      user.save();

      res.status(200).send({ message: "Password reset successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
// Código existente...




exports.enviarSolicitudConfirmada = (req, res) => {
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

exports.enviarSolicitudRechazada = (req, res) => {
  const { email } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      emailService.sendSolicitudRechazadoEmail(email);

      res.status(200).send({ message: 'Confirmation email sent.' });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};

exports.enviarEvaluacionAprovado = (req, res) => {
  const { email, nota } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      emailService.sendEvaluacionAprobadoEmail(email, nota);

      res.status(200).send({ message: 'Confirmation email sent.' });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};

exports.enviarEvaluacionFallida = (req, res) => {
  const { email, nota } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      emailService.sendEvauacionFallidaEmail(email, nota);

      res.status(200).send({ message: 'Confirmation email sent.' });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};

exports.enviarEvaluacionAgotado = (req, res) => {
  const { email } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      emailService.sendEvauacionTiempoAgotadoEmail(email);

      res.status(200).send({ message: 'Confirmation email sent.' });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};


exports.sendConfirmationEmail = (req, res) => {
  const { email } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      // Generar token de verificación de cuenta
      const verificationToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: "24h" // El token expirará después de 24 horas
      });

      // Guardar el token en el modelo de usuario
      user.verificationToken = verificationToken;
      user.save();

      // Enviar correo de confirmación de cuenta
      emailService.sendConfirmationEmail(email, verificationToken);

      res.status(200).send({ message: 'Confirmation email sent.' });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};


// exports.verifyAccount = (req, res) => {
//   const { token } = req.params;

//   jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Invalid or expired verification token." });
//     }

//     const userId = decoded.id;

//     User.findByPk(userId)
//       .then(user => {
//         if (!user) {
//           return res.status(404).send({ message: 'User not found.' });
//         }

//         // Marcar la cuenta como autenticada
//         user.isVerified = true;
//         user.save();

//         // Aquí puedes redirigir al usuario a una página de éxito de autenticación
//         res.status(200).send({ message: 'Account successfully verified.' });
//       })
//       .catch(error => {
//         res.status(500).send({ message: error.message });
//       });
//   });
// };
