
const db = require("../config");
const User= db.user;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.findAll = (req, res) => {
  const username = req.query.username;
var condition = username ? { username: { [Op.iLike]: `%${username}%` } } : null;

User.findAll({ where: condition })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Users."
    });
  });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

User.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find User with id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving User with id=" + id
    });
  });
};

// Update a User by the id in the request
exports.update = (req, res) => {
const id = req.params.id;

User.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "User was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating User with id=" + id
    });
  });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

User.destroy({
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "User was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete User with id=${id}. Maybe User was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete User with id=" + id
    });
  }); 
}; 

exports.updateHash = (req, res) => {
  const id = req.params.id;
  const {password } = req.body;
  // const {email} = req.body;

  // Hashear la nueva contraseña si se proporcionó
  const hashedPassword = password ? bcrypt.hashSync(password, 8) : undefined;

  User.update(
    { password: hashedPassword },
    
    { where: { id: id } }
  )
    .then((num) => {
      if (num == 1) {
        res.send({ message: "User was updated successfully." });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating User with id=" + id });
    });
};
