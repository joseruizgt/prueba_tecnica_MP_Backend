const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/init-models');


const validarJWT = async (req = request, res = response, next) => {

  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No existe un token de validación en la petición'
    });
  }

  try {

    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    // leer el usuario que corresponde al uid
    const usuario = await Usuario.findByPk(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe DB'
      });
    }

    // Verificar si el uid tiene estado true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no válido - usuario con estado deshabilitado'
      });
    }

    req.usuario = usuario;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(600).json({
        msg: 'Token expiró'
      })
    } else {
      return res.status(500).json({
        msg: 'Error interno'
      })
    }
  }

};

module.exports = {
  validarJWT
};