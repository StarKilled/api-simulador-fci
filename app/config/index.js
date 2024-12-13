const config = require("./db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    port: config.PORT,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


// Simulacion
db.area_estudio = require("../models/area_estudio.model.js")(sequelize, Sequelize);
db.area_software = require("../models/area_software.model.js")(sequelize, Sequelize);
db.pregunta_software = require("../models/pregunta_software.model.js")(sequelize, Sequelize);
db.opciones = require("../models/opciones.model.js")(sequelize, Sequelize);
//db.imagenes = require("../models/imagenes.model.js")(sequelize, Sequelize);
// Usuario y su roles
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model")(sequelize, Sequelize);

//Evaluaciones
db.tipo_evaluacion = require("../models/tipo_evaluacion.model.js")(sequelize, Sequelize);
db.evaluadores = require("../models/evaluadores.model.js")(sequelize, Sequelize);
db.evaluacion = require("../models/evaluacion.model.js")(sequelize, Sequelize);
//Solicitudes
db.solicitudes = require("../models/solicitudes.model.js")(sequelize, Sequelize);
db.solicitud_area = require("../models/solicitud_area.model.js")(sequelize, Sequelize);
//db.solicitud_area = require("./solicitud_area.model.js")(sequelize, Sequelize);
db.respuesta_evaluacion = require("../models/respuesta_evaluacion.model.js")(sequelize, Sequelize);
//db.respuesta_cuestonario_solicitud = require("./respuesta_cuestonario_solicitud.model.js")(sequelize, Sequelize);
// CErtificado
db.certificado = require("../models/certificado.model.js")(sequelize, Sequelize);

// m-m de Usuario y roles
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "id_user",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "id_user",
  otherKey: "id_role"
});

// Token
db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});

db.ROLES = ["user", "docente", "admin", "certificador"];



// m-m solicitud_area
db.solicitudes.belongsToMany(db.area_estudio, {
  
  through: db.solicitud_area,
  foreignKey: "id_solicitud",
  otherKey: "id_area_estudio"
});
db.area_estudio.belongsToMany(db.solicitudes, {
  through: db.solicitud_area,
  foreignKey: "id_area_estudio",
  otherKey: "id_solicitud"
});




db.evaluacion.hasMany(db.respuesta_evaluacion, { foreignKey: "evaluacionId" });
db.respuesta_evaluacion.belongsTo(db.evaluacion, { foreignKey: "evaluacionId" });

db.opciones.hasMany(db.respuesta_evaluacion, { foreignKey: "opcionesId" });
db.respuesta_evaluacion.belongsTo(db.opciones, { foreignKey: "opcionesId" });

db.pregunta_software.hasMany(db.respuesta_evaluacion, { foreignKey: "pregunta_SoftwareId" });
db.respuesta_evaluacion.belongsTo(db.pregunta_software, { foreignKey: "pregunta_SoftwareId" });


// 1-M  area_estudio - Area_Software -
db.area_estudio.hasMany(db.area_software, { as: "area_software", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.area_software.belongsTo(db.area_estudio, {
  foreignKey: "areaEstudioId",
  as: "area_estudio",
});
// 1-m Area_software - pregunta
db.area_software.hasMany(db.pregunta_software, { as: "pregunta_software", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.pregunta_software.belongsTo(db.area_software, {
  foreignKey: "areaSoftwareId",
  as: "area_software",
});
// 1-m pregunta - opciones
db.pregunta_software.hasMany(db.opciones, { as: "opciones" , onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.opciones.belongsTo(db.pregunta_software, {
  foreignKey: "preguntaSoftwareId",
  as: "pregunta_software",
});
// 1-m usuario - solicitude
db.user.hasMany(db.solicitudes, { as: "solicitudes" , onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db.solicitudes.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});
// 1-m tipo_evaluacion - solicitud
db.tipo_evaluacion.hasMany(db.solicitudes, { as: "solicitudes" });
db.solicitudes.belongsTo(db.tipo_evaluacion, {
  foreignKey: "tipoEvaluacionId",
  as: "tipo_evaluacion",
});
// 1-m Solicitud - evaluacion
db.solicitudes.hasMany(db.evaluacion, { as: "evaluacion" });
db.evaluacion.belongsTo(db.solicitudes, {
  foreignKey: "solicitudeId",
  as: "solicitudes",
});



// 1-m evaluacin - certificado
db.evaluacion.hasMany(db.certificado, { as: "certificado" });
db.certificado.belongsTo(db.evaluacion, {
  foreignKey: "evaluacionId",
  as: "evaluacion",
});
// 1-m evaluadores - certificado
db.evaluadores.hasMany(db.certificado, { as: "certificado" });
db.certificado.belongsTo(db.evaluadores, {
  foreignKey: "evaluadoreId",
  as: "evaluadores",
});
// 1-m evaluadores usuario
db.user.hasMany(db.evaluadores, { as: "evaluadores" , onDelete: 'CASCADE', onUpdate: 'CASCADE'});
db.evaluadores.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});


module.exports = db;