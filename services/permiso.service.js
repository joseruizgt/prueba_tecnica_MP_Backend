const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const { Permiso } = require('../models/init-models');
const { success, error } = require('../helpers/respuestas');
const { successMessages, errorMessages } = require('../messages/es');
const { postFields, paginationManagement, putFields, deleteFields } = require('../helpers/generalServices');


exports.getList = async () => {
    try {
        const where = {
            estado: 1,
            borrado: 0
        };

        const [total, lista] = await Promise.all([
            Permiso.count({
                where
            }),
            Permiso.findAll({
                where
            })
        ]);
        return success({ total, lista }, successMessages.SUCCESS_FINDALL);

    } catch (e) {
        return error(errorMessages.ERROR_FINDALL, e);
    }
};

exports.saveItem = async (objeto) => {
    try {
        objeto = postFields(objeto);
        const permiso = new Permiso(objeto);

        // Guardar en BD
        await permiso.save();

        return success(permiso, successMessages.SUCCESS_ADD);
    } catch (e) {
        return error(errorMessages.ERROR_ADD, e);
    }
};

exports.editItem = async (params, objeto) => {
    try {
        const { idPermiso } = params;

        objeto = putFields(objeto);

        await Permiso.update(objeto, { where: { idPermiso } });
        const itemEdit = await Permiso.findOne({ where: { idPermiso } });

        return success(itemEdit, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        return error(errorMessages.ERROR_UPDATE, e);
    }
};

exports.deleteItem = async (objeto) => {
    try {
        const { idPermiso } = objeto;
        const permiso = await Permiso.update({ ...deleteFields() }, { where: { idPermiso } });

        return success(permiso, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        return error(errorMessages.ERROR_DELETE, e);
    }
};