module.exports = (sequelize, Sequelize) => {
  const Respuesta_evaluacion = sequelize.define("respuesta_evaluacion", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    evaluacionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    opcionesId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    pregunta_SoftwareId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Respuesta_evaluacion;
};
