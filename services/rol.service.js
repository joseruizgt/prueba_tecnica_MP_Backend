const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const { Rol, Permiso_rol, Permiso } = require('../models/init-models');
const { success, error } = require('../helpers/respuestas');
const { successMessages, errorMessages } = require('../messages/es');
const { postFields, paginationManagement, putFields, deleteFields, generateDateNow } = require('../helpers/generalServices');


exports.getList = async (objeto) => {
    try {
        let { busqueda = '', limite = 5, pagina = 1 } = objeto;

        busqueda = busqueda.trim();
        const { page, limit, offset } = paginationManagement(limite, pagina);

        const where = {
            rol: { [Op.substring]: busqueda }
        };

        const [total, lista] = await Promise.all([
            Rol.count({
                where
            }),
            Rol.findAll({
                where,
                limit,
                offset
            })
        ]);
        return success({ total, lista, totalPaginas: page !== 0 ? Math.ceil(total / limit) : 1 }, successMessages.SUCCESS_FINDALL);

    } catch (e) {
        return error(errorMessages.ERROR_FINDALL, e);
    }
};

exports.saveItem = async (objeto) => {
    try {
        objeto = postFields(objeto);
        const rol = new Rol(objeto);

        // Guardar en BD
        await rol.save();

        return success(rol, successMessages.SUCCESS_ADD);
    } catch (e) {
        return error(errorMessages.ERROR_ADD, e);
    }
};

exports.editItem = async (params, objeto) => {
    try {
        const { idRol } = params;

        objeto = putFields(objeto);

        await Rol.update(objeto, { where: { idRol } });
        const itemEdit = await Rol.findOne({ where: { idRol } });

        return success(itemEdit, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        return error(errorMessages.ERROR_UPDATE, e);
    }
};

exports.deleteItem = async (objeto) => {
    try {
        const { idRol } = objeto;
        const rol = await Rol.update({ ...deleteFields() }, { where: { idRol } });

        return success(rol, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        return error(errorMessages.ERROR_DELETE, e);
    }
};

exports.getListForPermissions = async (objeto) => {
    try {
        let { busqueda = '', limite = 5, pagina = 1 } = objeto;

        busqueda = busqueda.trim();
        const { page, limit, offset } = paginationManagement(limite, pagina);

        const where = {
            rol: { [Op.substring]: busqueda },
        };

        const [total, lista] = await Promise.all([
            Rol.count({
                where
            }),
            Rol.findAll({
                where,
                limit,
                offset,
                attributes: ['idRol', 'rol', 'descripcion', 'fecha_creacion']
            })
        ]);

        let listaAux = [];
        for (let i = 0; i < lista.length; i++) {
            let permisos = await Permiso_rol.findAll({
                where: {
                    id_rol: lista[i].idRol,
                    estado: 1,
                    borrado: 0
                },
                include: [
                    {
                        model: Permiso,
                        as: 'permiso',
                        attributes: ['permiso', 'codigo']
                    }
                ],
                attributes: ['id_permiso']
            });

            listaAux.push({
                idRol: lista[i].idRol,
                rol: lista[i].rol,
                descripcion: lista[i].descripcion,
                fecha_creacion: lista[i].fecha_creacion,
                permisos
            });
        }


        return success({ total, lista: listaAux, totalPaginas: page !== 0 ? Math.ceil(total / limit) : 1 }, successMessages.SUCCESS_FINDALL);

    } catch (e) {
        return error(errorMessages.ERROR_FINDALL, e);
    }
};

exports.saveRolPermissions = async (params, objeto) => {
    try {
        for (let i = 0; i < objeto.permisos.length; i++) {
            let rolPermissions = new Permiso_rol({
                idPermiso: objeto.permisos[i].id_permiso,
                idRol: params.id_rol,
                estado: 1,
                borrado: 0,
                fecha_creacion: generateDateNow()
            });
            await rolPermissions.save();
        }

        return success({}, successMessages.SUCCESS_ADD);
    } catch (e) {
        return error(errorMessages.ERROR_ADD, e);
    }
};

exports.deleteRolPermissions = async (params, body) => {
    try {
        const { id_rol, } = params;

        for (let i = 0; i < body.permisos.length; i++) {
            let rolPermissions = await Permiso_rol.update({ ...deleteFields() },
                {
                    where: {
                        id_rol,
                        id_permiso: body.permisos[i].id_permiso,
                    }
                });
        }

        return success({}, successMessages.SUCCESS_DELETE);
    } catch (e) {
        return error(errorMessages.ERROR_DELETE, e);
    }
};
