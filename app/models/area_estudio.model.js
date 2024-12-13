module.exports = (sequelize, Sequelize) => {
    const Area_estudio = sequelize.define("area_estudio", {

      area: {
        type: Sequelize.STRING
      }
    });
  
    

    return Area_estudio;
  };