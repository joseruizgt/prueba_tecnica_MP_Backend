const bcryptjs = require('bcryptjs');
const CryptoJS = require('crypto-js');
const { Op } = require('sequelize');
const { Usuario, Rol, Agencia, Puesto, Fiscalia } = require('../models/init-models');
const { success, error } = require('../helpers/respuestas');
const { successMessages, errorMessages } = require('../messages/es');
const { postFields, paginationManagement, putFields, deleteFields } = require('../helpers/generalServices');


exports.getList = async (objeto) => {
  try {
    let { busqueda = '', limite = 5, pagina = 1, estado = 1, idFiscalia = '' } = objeto;
    busqueda = busqueda.trim();
    estado = Number.parseInt(estado);

    const { page, limit, offset } = paginationManagement(limite, pagina, busqueda);

    // console.log(page, limit, offset, 'pruebaaa');

    let where = {
      [Op.or]: [
        { nombre: { [Op.substring]: busqueda } },
        { apellido: { [Op.substring]: busqueda } },
        { usuario: { [Op.substring]: busqueda } },
      ],
      estado,
      borrado: 0
    };

    if (idFiscalia !== '') {
      idFiscalia = Number.parseInt(idFiscalia);
      where = { ...where, idFiscalia }
    }

    const [total, lista, activos, deshabilitados] = await Promise.all([
      Usuario.count({
        where
      }),
      Usuario.findAll({
        where,
        include: [
          {
            model: Rol,
            attributes: ['idRol', 'rol']
          },
          {
            model: Fiscalia,
            as: 'fiscalia',
            attributes: ['idFiscalia', 'fiscalia']
          },
          {
            model: Puesto,
            as: 'puesto',
            attributes: ['idPuesto', 'puesto']
          },
        ],
        attributes: ['idUsuario', 'nombre', 'apellido', 'usuario', 'correo_electronico', 'estado'],
        limit,
        offset
      }),

      Usuario.count({
        where: {
          estado: 1
        }
      }),
      Usuario.count({
        where: {
          estado: 0,
          borrado: 0
        }
      }),

    ]);

    return success({ total, lista, activos, deshabilitados, totalPaginas: page !== 0 ? Math.ceil(total / limit) : 1 }, successMessages.SUCCESS_FINDALL);

  } catch (e) {
    return error(errorMessages.ERROR_FINDALL, e);
  }
};

exports.getItem = async (objeto) => {
  try {
    const { id = 0 } = objeto;

    const [item] = await Promise.all([
      Usuario.findByPk(id, {
        include: [
          {
            model: Rol,
            attributes: ['idRol', 'rol']
          },
          {
            model: Agencia,
            as: 'agencia',
            attributes: ['idAgencia', 'agencia']
          },
          {
            model: Puesto,
            as: 'puesto',
            attributes: ['idPuesto', 'puesto']
          },
          {
            model: Usuario,
            as: 'jefeAprueba',
            attributes: ['idUsuario', 'nombre', 'apellido']
          },
          {
            model: Usuario,
            as: 'jefeAutoriza',
            attributes: ['idUsuario', 'nombre', 'apellido']
          },
        ],
        attributes: ['idUsuario', 'nombre', 'apellido', 'usuario', 'correo_electronico', 'telefono', 'auxiliar', 'cuenta_ahorro_disponible'],
      })
    ]);

    return success(item, successMessages.SUCCESS_FIND);
  } catch (e) {
    return error(errorMessages.ERROR_FIND, e);
  }
};

exports.saveItem = async (objeto) => {
  try {

    // Validar si el usuario ya existe
    objeto = { ...objeto, usuario: objeto.usuario.toUpperCase() }

    const userExist = await Usuario.findOne({
      where: {
        usuario: objeto.usuario
      }
    });

    if (userExist) {
      return error(errorMessages.ERROR_USUARIO);
    }

    objeto = postFields(objeto);
    const user = new Usuario(objeto);

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.contrasenia = bcryptjs.hashSync(objeto.contrasenia, salt);

    // Guardar en BD
    await user.save();
    user.password = undefined;

    return success(user, successMessages.SUCCESS_ADD);
  } catch (e) {
    return error(errorMessages.ERROR_ADD, e);
  }
};

exports.editItem = async (params, objeto) => {
  try {
    const { idUsuario } = params;

    objeto = putFields(objeto);


    if (objeto.contrasenia && objeto.contrasenia !== '') {
      // Encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      objeto.contrasenia = bcryptjs.hashSync(objeto.contrasenia, salt);
    } else {
      delete objeto.contrasenia;
    }

    const itemEdit = await Usuario.update(objeto, { where: { idUsuario } }
    );
    return success(itemEdit, successMessages.SUCCESS_UPDATE);
  } catch (e) {
    return error(errorMessages.ERROR_UPDATE, e);
  }
};

exports.deleteItem = async (objeto) => {

  const { idUsuario } = objeto;
  try {
    const user = await Usuario.update({ ...deleteFields() }, { where: { idUsuario } });

    return success(user, successMessages.SUCCESS_UPDATE);
  } catch (e) {
    return error(errorMessages.ERROR_DELETE, e);
  }
};

exports.getListActive = async (objeto) => {
  try {
    let where = {
      estado: 1,
      borrado: 0
    };
    const [total, lista] = await Promise.all([
      Usuario.count({
        where
      }),
      Usuario.findAll({
        where,
        include: [
          {
            model: Rol,
            attributes: ['idRol', 'rol']
          },
          {
            model: Agencia,
            as: 'agencia',
            attributes: ['idAgencia', 'agencia']
          },
          {
            model: Puesto,
            as: 'puesto',
            attributes: ['idPuesto', 'puesto']
          },
          {
            model: Usuario,
            as: 'jefeAprueba',
            attributes: ['idUsuario', 'nombre', 'apellido']
          },
          {
            model: Usuario,
            as: 'jefeAutoriza',
            attributes: ['idUsuario', 'nombre', 'apellido']
          },
        ],
        attributes: ['idUsuario', 'nombre', 'apellido', 'usuario', 'correo_electronico', 'telefono', 'auxiliar', 'cuenta_ahorro_disponible', 'estado', 'cantidad_vales'],
      }),
    ]);

    return success({ total, lista }, successMessages.SUCCESS_FINDALL);

  } catch (e) {
    return error(errorMessages.ERROR_FINDALL, e);
  }
};

exports.getListInactive = async (objeto) => {
  try {
    let where = {
      estado: 0,
      borrado: 0
    };
    const [total, lista] = await Promise.all([
      Usuario.count({
        where
      }),
      Usuario.findAll({
        where,
        include: [
          {
            model: Rol,
            attributes: ['idRol', 'rol']
          },
          {
            model: Agencia,
            as: 'agencia',
            attributes: ['idAgencia', 'agencia']
          },
          {
            model: Puesto,
            as: 'puesto',
            attributes: ['idPuesto', 'puesto']
          },
          {
            model: Usuario,
            as: 'jefeAprueba',
            attributes: ['idUsuario', 'nombre', 'apellido']
          },
          {
            model: Usuario,
            as: 'jefeAutoriza',
            attributes: ['idUsuario', 'nombre', 'apellido']
          },
        ],
        attributes: ['idUsuario', 'nombre', 'apellido', 'usuario', 'correo_electronico', 'telefono', 'auxiliar', 'cuenta_ahorro_disponible', 'estado', 'cantidad_vales'],
      }),
    ]);

    return success({ total, lista }, successMessages.SUCCESS_FINDALL);

  } catch (e) {
    return error(errorMessages.ERROR_FINDALL, e);
  }
};
