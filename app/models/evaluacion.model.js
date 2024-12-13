module.exports = (sequelize, Sequelize) => {
  const Evaluacion = sequelize.define("evaluacion", {
    nota: {
      type: Sequelize.DECIMAL
    },
    fecha_inicio: {
      type: Sequelize.DATE
    },
    fecha_fin: {
      type: Sequelize.DATE
    },
    estado_e: {
      type: Sequelize.STRING
    },
  });

  return Evaluacion;
};
