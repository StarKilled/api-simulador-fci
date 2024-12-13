module.exports = (sequelize, Sequelize) => {
  const SolicitudArea = sequelize.define("solicitud_area", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_solicitud: {
      type: Sequelize.INTEGER,
    },
    id_area_estudio: {
      type: Sequelize.INTEGER,
    }
  });

  return SolicitudArea;
};
