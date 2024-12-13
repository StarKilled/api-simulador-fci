module.exports = (sequelize, Sequelize) => {
    const Solicitudes = sequelize.define("solicitudes", {
      fecha_solicitud: {
        type: Sequelize.DATE
      },
      estado: {
        type: Sequelize.STRING
      },
      comentario: {
        type: Sequelize.STRING
      }
    });



    
  
    return Solicitudes;
  };