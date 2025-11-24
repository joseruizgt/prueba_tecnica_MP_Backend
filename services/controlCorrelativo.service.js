const { Op } = require('sequelize');
const { Control_correlativo } = require('../models/init-models');
const { success, error } = require('../helpers/respuestas');
const { successMessages, errorMessages, generalMessages } = require('../messages/es');
const { postFields, paginationManagement, putFields, deleteFields, dateManagement, generateDateNow } = require('../helpers/generalServices');

exports.obtenerNuevoCorrelativo = async (dateManagement, tipoCorrelativo, t) => {
    try {
        const { year } = dateManagement;
        const correlativo = await Control_correlativo.findOne({
            where: {
                anio_correlativo: year,
                tipo_correlativo: tipoCorrelativo,
                estado: 1,
                borrado: 0,
            },
            attributes: [
                'id_control_correlativo',
                'anio_correlativo',
                'numero_correlativo',
                'tipo_correlativo'
            ],
            transaction: t
        });

        if (!correlativo) {
            const crearCorrelativoAnioNuevo = await this.crearCorrelativo(dateManagement, tipoCorrelativo, t);
            if (!crearCorrelativoAnioNuevo.valid) {
                return error(errorMessages.ERROR_ADD);
            }
            return crearCorrelativoAnioNuevo;
        }

        // Incrementa el número correlativo
        let correlativoAux = correlativo;
        correlativoAux.numero_correlativo += 1;

        // Actualiza el correlativo en la base de datos
        const correlativoActualizado = await this.actualizarCorrelativo(
            correlativoAux.anio_correlativo,
            correlativoAux.tipo_correlativo,
            { numero_correlativo: correlativoAux.numero_correlativo },
            t
        );

        if (!correlativoActualizado.valid) {
            return error(errorMessages.ERROR_UPDATE);
        }

        // await t.commit();
        return success(correlativoAux, successMessages.SUCCESS_FIND);
    } catch (e) {
        await t.rollback();
        return error(errorMessages.ERROR_FIND, e);
    }
}

exports.crearCorrelativo = async (dateManagement, tipo_correlativo, t) => {
    try {
        const { year } = dateManagement;

        //actualiza el correlativo anterior colocando el estado en 0
        let dataActualizar = {
            estado: 0
        }
        dataActualizar = putFields(dataActualizar);

        await Control_correlativo.update(
            dataActualizar,
            {
                where: { tipo_correlativo, anio_correlativo: year - 1 },
                transaction: t,
            }
        );

        //crea un nuevo correlativo
        let data = {
            numero_correlativo: 1,
            tipo_correlativo,
            anio_correlativo: year,
        }
        data = postFields(data);

        const correlativo = await Control_correlativo.create(
            data,
            { transaction: t }
        );

        // await t.commit();
        return success(correlativo, successMessages.SUCCESS_CORRELATIVO);
    } catch (e) {
        await t.rollback();
        return error(errorMessages.ERROR_ADD, e);
    }
}

exports.actualizarCorrelativo = async (anio_correlativo, tipo_correlativo, data, t) => {
    try {
        data = putFields(data);
        await Control_correlativo.update(
            data,
            {
                where: { anio_correlativo, tipo_correlativo },
                transaction: t,
            }
        );

        // await t.commit();
        return success({}, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        await t.rollback();
        return error(errorMessages.ERROR_UPDATE, e);
    }
}