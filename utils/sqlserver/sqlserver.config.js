const { Sequelize } = require("sequelize");

/** CREAR CONEXIÓN A BD SQL SERVER */
const sequelize = new Sequelize(
    process.env.SQLSERVER_NAME,      // nombre BD
    process.env.SQLSERVER_USERNAME,  // usuario
    process.env.SQLSERVER_PASSWORD,  // password
    {
        host: process.env.SQLSERVER_HOST,
        port: parseInt(process.env.SQLSERVER_PORT), // normalmente 1433
        dialect: "mssql",
        dialectModule: require('tedious'),
        dialectOptions: {
            options: {
                encrypt: true,              // obligatorio si usas Azure u otros hosts con TLS
                trustServerCertificate: true // úsalo solo en dev
            }
        },
        pool: {
            max: parseInt(process.env.SQLSERVER_POOL_MAX) || 5,
            min: parseInt(process.env.SQLSERVER_POOL_MIN) || 0,
            acquire: parseInt(process.env.SQLSERVER_POOL_ACQUIRE) || 30000,
            idle: parseInt(process.env.SQLSERVER_POOL_IDLE) || 10000,
        },
        logging: parseInt(process.env.LOGGING_SEQUELIZE) === 1 ? true : false,
    }
);

async function conectarDBSQL() {
    try {
        await sequelize.authenticate();
        console.log("Conexión a SQL Server realizada correctamente.");
    } catch (error) {
        console.error("No se pudo conectar a SQL Server:", error);
    }
}

module.exports.sequelize = sequelize;
module.exports.connectionBDSQL = conectarDBSQL;