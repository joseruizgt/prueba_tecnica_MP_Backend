const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const { Puesto } = require('../models/init-models');
const { success, error } = require('../helpers/respuestas');
const { successMessages, errorMessages } = require('../messages/es');
const { postFields, paginationManagement, putFields, deleteFields } = require('../helpers/generalServices');


exports.getList = async (objeto) => {
    try {
        let { busqueda = '', limite = 5, pagina = 1 } = objeto;

        busqueda = busqueda.trim();
        const { page, limit, offset } = paginationManagement(limite, pagina);

        const where = {
            puesto: { [Op.substring]: busqueda },
            estado: 1,
            borrado: 0
        };

        const [total, lista] = await Promise.all([
            Puesto.count({
                where
            }),
            Puesto.findAll({
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
        const job = new Puesto(objeto);

        // Guardar en BD
        await job.save();

        return success(job, successMessages.SUCCESS_ADD);
    } catch (e) {
        return error(errorMessages.ERROR_ADD, e);
    }
};

exports.editItem = async (params, objeto) => {
    try {
        const { idPuesto } = params;

        objeto = putFields(objeto);

        await Puesto.update(objeto, { where: { idPuesto } });
        const itemEdit = await Puesto.findOne({ where: { idPuesto } });

        return success(itemEdit, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        return error(errorMessages.ERROR_UPDATE, e);
    }
};

exports.deleteItem = async (objeto) => {
    try {
        const { idPuesto } = objeto;
        const job = await Puesto.update({ ...deleteFields() }, { where: { idPuesto } });

        return success(job, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        return error(errorMessages.ERROR_DELETE, e);
    }
};
