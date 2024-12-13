module.exports = (sequelize, Sequelize) => {
    const Tipo_evaluacion = sequelize.define("tipo_evaluacion", {

      naturaleza: {
        type: Sequelize.STRING
      }
    });
  
    return Tipo_evaluacion;
  };