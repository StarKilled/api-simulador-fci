module.exports = (sequelize, Sequelize) => {
    const Pregunta_software = sequelize.define("pregunta_software", {

      pregunta: {
        type: Sequelize.STRING
      },
      imagen: {
        type: Sequelize.STRING
      }
    });
  
    return Pregunta_software;
  };