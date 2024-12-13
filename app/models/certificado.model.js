module.exports = (sequelize, Sequelize) => {
    const Certificado = sequelize.define("certificado", {


      fecha_emision: {
        type: Sequelize.DATE
      },
      codigo_certificado: {
        type: Sequelize.TEXT
      },
      descargado:{
        type: Sequelize.INTEGER
      }
    });
  
    return Certificado;
  };