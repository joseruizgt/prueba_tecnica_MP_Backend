const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const { Fiscalia } = require('../models/init-models');
const { success, error } = require('../helpers/respuestas');
const { successMessages, errorMessages } = require('../messages/es');
const { postFields, paginationManagement, putFields, deleteFields } = require('../helpers/generalServices');


exports.getListFiscalia = async (objeto) => {
    try {
        let { busqueda = '', limite = 5, pagina = 1 } = objeto;

        busqueda = busqueda.trim();
        const { page, limit, offset } = paginationManagement(limite, pagina);

        const where = {
            fiscalia: { [Op.substring]: busqueda }
        };

        const [total, lista] = await Promise.all([
            Fiscalia.count({
                where
            }),
            Fiscalia.findAll({
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
        const fiscalia = new Fiscalia(objeto);

        // Guardar en BD
        await fiscalia.save();

        return success(fiscalia, successMessages.SUCCESS_ADD);
    } catch (e) {
        return error(errorMessages.ERROR_ADD, e);
    }
};

exports.editItem = async (params, objeto) => {
    try {
        const { idFiscalia } = params;

        objeto = putFields(objeto);

        await Fiscalia.update(objeto, { where: { idFiscalia } });
        const itemEdit = await Fiscalia.findOne({ where: { idFiscalia } });

        return success(itemEdit, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        return error(errorMessages.ERROR_UPDATE, e);
    }
};

exports.deleteItem = async (objeto) => {
    try {
        const { idFiscalia } = objeto;
        const fiscalia = await Fiscalia.update({ ...deleteFields() }, { where: { idFiscalia } });

        return success(fiscalia, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        return error(errorMessages.ERROR_DELETE, e);
    }
};