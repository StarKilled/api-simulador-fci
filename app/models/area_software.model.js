module.exports = (sequelize, Sequelize) => {
    const Area_software = sequelize.define("area_software", {

      software: {
        type: Sequelize.STRING
      }
    });
  
    return Area_software;
  };