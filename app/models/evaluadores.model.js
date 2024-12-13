module.exports = (sequelize, Sequelize) => {
    const Evaluadores = sequelize.define("evaluadores", {

      activo: {
        type: Sequelize.INTEGER
      }
    });
  
    return Evaluadores;
  };