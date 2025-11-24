const express = require('express');
const cors = require('cors');
const { connectionBDSQL } = require('../utils/sqlserver/sqlserver.config');
const cookieParser = require('cookie-parser');

// const { dbConnection } = require('../database/config');

const whiteList = process.env.ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {

    // para peticiones tipo Postman, curl, server-side
    // solo se utiliza en desarrollo
    if (!origin) {
      return callback(null, true);
    }

    const exist = whiteList.some(domain => domain === origin);
    if (exist) {
      callback(null, true);
    } else {
      callback(new Error('Access denied'));
    }
  },
  credentials: true
}

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Conectar a base de datos
    connectionBDSQL();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  middlewares() {
    // CORS
    this.app.use(cors(corsOptions));

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static('public'));

    this.app.use(cookieParser());
  }

  routes() {
    this.app.use('/api', require('../routes/routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    });
  }
}

module.exports = Server;
