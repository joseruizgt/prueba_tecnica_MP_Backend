const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { Usuario, Rol, Permiso_rol, Permiso, Fiscalia } = require('../models/init-models');
const { generarJWT } = require('../helpers/generar-jwt');
const { errorMessages, successMessages } = require('../messages/es');
const { error, success } = require('../helpers/respuestas');


exports.login = async (req = request, res = response) => {
  const { usuario, contrasenia, fiscalia } = req.body;
 
    // Verificar si el usuario existe
    const usuarioEncontrado = await Usuario.findOne({
      where: {
        usuario
      }
    });

    if (!usuarioEncontrado) {
      return res.status(202).json(error(errorMessages.ERROR_LOGIN, ''));
    }
    // SI el usuario está activo
    if (usuarioEncontrado.estado !== 1) {
      return res.status(202).json(error(errorMessages.ERROR_USUARO_BLOQUEADO, 'Comuniquese con el administrador'));
    }

    // Si la fiscalia existe
    const fiscaliaEncontrada = await Fiscalia.findOne({
      where: {
        fiscalia: fiscalia.toUpperCase()
      }
    });

    if (!fiscaliaEncontrada) {
      return res.status(202).json(error(errorMessages.ERROR_FISCALIA_NO_ENCONTRADA, ''));
    }

    // Verificar que la fiscalia coincida con la del usuario
    if (fiscaliaEncontrada.idFiscalia !== usuarioEncontrado.idFiscalia) {
      return res.status(202).json(error(errorMessages.ERROR_FISCALIA_NO_ENCONTRADA, ''));
    }

    // Verificar la contraseña
    const validarContrasenia = bcryptjs.compareSync(contrasenia, usuarioEncontrado.contrasenia);
    if (!validarContrasenia) {
      return res.status(202).json(error(errorMessages.ERROR_LOGIN, ''));
    }

    const rol = CryptoJS.AES.encrypt(usuarioEncontrado.idRol.toString(), 'TYd23@201642').toString();
    usuarioEncontrado.password = undefined;
    usuarioEncontrado.estado = undefined;

    const nombreRol = await Rol.findOne({
      where: {
        idRol: usuarioEncontrado.idRol
      }
    });

    const permisos = await Permiso_rol.findAll({
      where: {
        id_rol: usuarioEncontrado.idRol,
        estado: 1,
        borrado: 0
      },
      include: [
        {
          model: Permiso,
          as: 'permiso',
          attributes: ['codigo']
        }
      ],
    });

    let permisosAux = [];
    permisos.forEach(item => {
      permisosAux.push(
        item.permiso.codigo
      )
    });

    // Generar el JWT
    const token = await generarJWT(usuarioEncontrado.idUsuario);

    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: false, // EN DESARROLLO usa false, en producción debe ser true con HTTPS
      sameSite: 'Strict',
      maxAge: 10800000, // 3 horas
    });

    res.status(200).json(success({
      token: token.accessToken,
      // refreshToken: token.refreshToken,
      rol,
      usuario: {
        id: usuarioEncontrado.idUsuario,
        nombre: usuarioEncontrado.nombre,
        apellido: usuarioEncontrado.apellido,
        acceso: nombreRol.rol,
        cambio_contrasenia: usuarioEncontrado.cambio_contrasenia,
        idFiscalia: usuarioEncontrado.idFiscalia
      },
      permisos: permisosAux
    }, successMessages.SUCCESS_LOGIN));

  
};

exports.refreshToken = async (req = request, res = response) => {
  const tokenRefresh = req.cookies.refreshToken;

  if (!tokenRefresh) {
    return res.status(401).json({ msg: 'No hay refresh token' });
  }

  try {
    const { uid } = jwt.verify(tokenRefresh, process.env.REFRESH_SECRET_KEY);

    const token = await generarJWT(uid);

    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: false, // EN DESARROLLO usa false, en producción debe ser true con HTTPS
      sameSite: 'Strict',
      maxAge: 10800000, // 3 horas
    });

    res.json({ accessToken: token.accessToken });

  } catch (error) {
    return res.status(403).json({ msg: 'Refresh token inválido o expirado' });
  }
}

exports.logout = async (req = request, res = response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'Strict'
  });

  res.status(200).json(success({
    resultado: 'Sesión cerrada correctamente'
  }));
}