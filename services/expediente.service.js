const { Op } = require('sequelize');
const { Usuario, Puesto, Rol, Expediente, Bitacora_expediente, Fiscalia } = require('../models/init-models');
const { success, error } = require('../helpers/respuestas');
const { successMessages, errorMessages, generalMessages } = require('../messages/es');
const { postFields, paginationManagement, putFields, deleteFields, dateManagement, generateDateNow } = require('../helpers/generalServices');
const { sequelize } = require('../utils/sqlserver/sqlserver.config');
const { obtenerNuevoCorrelativo } = require('./controlCorrelativo.service');


//obtener listado de expedientes trabajados por el usuario
exports.getList = async (req) => {
    try {
        let { busqueda = '', limite = 5, pagina = 1, tab = 1, fecha = '' } = req.query;
        const idFiscalia = req.usuario.idFiscalia;
        const idRol = req.usuario.idRol;

        const rol = await Rol.findByPk(idRol);
        busqueda = busqueda.trim();
        tab = Number.parseInt(tab);
        const { page, limit, offset } = paginationManagement(limite, pagina, busqueda);

        let where = {
            flag_rechazo: 0,
            estado: 1,
            borrado: 0
        };

        let fechaUso = {}
        if (fecha !== '') {
            if (tab >= 1 && tab <= 2) {
                fechaUso = {
                    fecha_creacion: fecha
                }
            } else {
                fechaUso = {
                    fecha_aprobado: fecha
                }
            }
        }
        //CREACION DEL EXPEDIENTE TAB 1, PENDIENTE APROBACION TAB 2, APROBADO TAB 3, RECHAZADO TAB 4
        if (tab >= 1 && tab <= 2) {
            if (rol.rol === 'ADMINISTRADOR') {
                where = { ...where, [Op.or]: [{ correlativo: { [Op.substring]: busqueda } }], fase: tab, ...fechaUso }
            } else {
                where = { ...where, [Op.or]: [{ correlativo: { [Op.substring]: busqueda } }], fase: tab, ...fechaUso, idFiscalia }
            }
        } else if (tab === 3) {
            if (rol.rol === 'ADMINISTRADOR') {
                where = { ...where, [Op.or]: [{ correlativo: { [Op.substring]: busqueda } }], fase: tab, ...fechaUso }
            } else {
                where = { ...where, [Op.or]: [{ correlativo: { [Op.substring]: busqueda } }], fase: tab, ...fechaUso, idFiscalia }
            }
        } else {
            if (rol.rol === 'ADMINISTRADOR') {
                where = { ...where, flag_rechazo: 1, [Op.or]: [{ correlativo: { [Op.substring]: busqueda } }] };
            } else {
                where = { ...where, flag_rechazo: 1, [Op.or]: [{ correlativo: { [Op.substring]: busqueda } }], idFiscalia };
            }
        }

        let whereFiscalia = {}
        if (rol.rol !== 'ADMINISTRADOR') {
            whereFiscalia = {
                idFiscalia
            }
        }
        const [total, lista, borradores, aprobar, autorizar, rechazados] = await Promise.all([
            //total registros
            Expediente.count({
                where
            }),
            //lista con limite y offset
            Expediente.findAll({
                where,
                attributes: ['idExpediente', 'correlativo', 'fase', 'delito', 'descripcion', 'fecha_creacion', 'fecha_aprobado', 'idUsuario', 'idFiscalia', 'flag_rechazo', 'motivo_rechazo'],
                limit,
                offset
            }),
            //borrador //ahora creacion de expediente
            Expediente.count({
                where: {
                    fase: 1,
                    flag_rechazo: 0,
                    estado: 1,
                    borrado: 0,
                    ...whereFiscalia
                }
            }),
            //aprobar // ahora pendiente de aprobacion
            Expediente.count({
                where: {
                    fase: 2,
                    flag_rechazo: 0,
                    estado: 1,
                    borrado: 0,
                    ...whereFiscalia
                }
            }),
            //autorizar // ahora aprobado
            Expediente.count({
                where: {
                    fase: 3,
                    flag_rechazo: 0,
                    estado: 1,
                    borrado: 0,
                    ...whereFiscalia
                }
            }),
            //rechazados
            Expediente.count({
                where: {
                    flag_rechazo: 1,
                    estado: 1,
                    borrado: 0,
                    ...whereFiscalia
                }
            }),
        ]);

        return success({ total, lista, borradores, aprobar, autorizar, rechazados, totalPaginas: page !== 0 ? Math.ceil(total / limit) : 1 }, successMessages.SUCCESS_FINDALL);

    } catch (e) {
        return error(errorMessages.ERROR_FINDALL, e);
    }
};

//crear un nuevo expediente
exports.saveItem = async (req) => {
    const t = await sequelize.transaction();
    try {
        let data = req.body;
        // let { flag_guardar_enviar = 0 } = req.query;
        data = postFields(data);
        data.idUsuario = req.usuario.idUsuario
        data.idFiscalia = req.usuario.idFiscalia;

        // CREACION DEL CORRELATIVO
        const { month } = dateManagement();

        //obtener el nuevo correlativo actual de la tabla control_correlativo
        const controlCorrelativo = await obtenerNuevoCorrelativo({ ...dateManagement() }, generalMessages.DICRI, t);

        if (!controlCorrelativo.valid) {
            return controlCorrelativo;
        }

        const { numero_correlativo, anio_correlativo, tipo_correlativo } = controlCorrelativo.data;

        data.correlativo = `${numero_correlativo}-${month}${anio_correlativo}-${tipo_correlativo}`;
        data.fase = 1;

        // Crear y guardar registro de expediente
        const expediente = await Expediente.create(data, { transaction: t });

        //crear registro en la bitacora de vales
        await Bitacora_expediente.create({ id_expediente: expediente.idExpediente, creacion: req.usuario.idUsuario, fecha_creacion: generateDateNow() }, { transaction: t });

        await t.commit();
        return success(expediente, successMessages.SUCCESS_ADD);
    } catch (e) {
        await t.rollback();
        return error(errorMessages.ERROR_ADD, e);
    }
};

// Edita un expediente
exports.editItem = async (params, objeto) => {
    const t = await sequelize.transaction();
    try {
        const { idExpediente } = params;
        objeto = putFields(objeto);

        const itemEdit = await Expediente.update(objeto, { where: { idExpediente }, transaction: t }
        );

        await t.commit();
        return success(itemEdit, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        await t.rollback();
        return error(errorMessages.ERROR_UPDATE, e);
    }
};

// Cambia la fase un expediente, puede ser enviado a aprobacion, aprobado o rechazado
exports.cambioFase = async (params, objeto, req) => {
    const t = await sequelize.transaction();
    try {
        let { idExpediente, fase } = params;
        fase = Number.parseInt(fase);
        objeto = putFields(objeto);

        if (fase === 2) { //mandando a aprobacion
            objeto.fase = fase;

        } else if (fase === 3) { //aprobado
            objeto.fecha_aprobado = generateDateNow();
            objeto.fase = fase;
            // await Bitacora_vale.update({ aprobacion: req.usuario.idUsuario, fecha_aprobacion: generateDateNow() }, { where: { id_vale: idVale }, transaction: t });
            await Bitacora_expediente.update({ aprobacion: req.usuario.idUsuario, fecha_aprobacion: generateDateNow() }, { where: { id_expediente: idExpediente }, transaction: t });

        } else {
            objeto.flag_rechazo = 1;
        }

        const itemEdit = await Expediente.update(objeto, { where: { idExpediente }, transaction: t });

        await t.commit();
        return success(itemEdit, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        await t.rollback();
        return error(errorMessages.ERROR_UPDATE, e);
    }
};

// Obtiene un expediente por su ID
exports.getItem = async (objeto) => {
    try {
        const { idExpediente = 0 } = objeto;

        const [item] = await Promise.all([
            Expediente.findByPk(idExpediente)
        ]);

        return success(item, successMessages.SUCCESS_FIND);
    } catch (e) {
        return error(errorMessages.ERROR_FIND, e);
    }
};

// Correccion de un expediente que fue rechazado
exports.correccionExpediente = async (req) => {
    try {
        const { idExpediente } = req.query;
        let body = req.body
        body.flag_rechazo = 0;
        body.motivo_rechazo = null;

        const expediente = await Expediente.update(body, { where: { idExpediente } });
        return success(expediente, successMessages.SUCCESS_FIND);
    } catch (error) {
        return error(errorMessages.ERROR_FIND, error);
    }



}

//elimina un expediente, lo marca como borrado
exports.deleteItem = async (objeto, req) => {
    const t = await sequelize.transaction();

    try {
        const { idExpediente } = objeto;

        const expediente = await Expediente.update({ ...deleteFields() }, { where: { idExpediente }, transaction: t });
        await Bitacora_expediente.update({ eliminado: req.usuario.idUsuario, fecha_eliminado: generateDateNow() }, { where: { id_expediente: idExpediente }, transaction: t });

        await t.commit();
        return success(expediente, successMessages.SUCCESS_UPDATE);
    } catch (e) {
        await t.rollback();
        return error(errorMessages.ERROR_DELETE, e);
    }
};

exports.getBitacoraIndividual = async (req) => {

    const { id_expediente } = req.query;

    let combinado = {
        where: {
            id_expediente
        },
        include: [
            {
                model: Expediente,
                attributes: ['correlativo', 'descripcion']
            },
            {
                model: Usuario,
                as: 'usuario_creo_expediente',
                include: [
                    {
                        model: Fiscalia,
                        as: 'fiscalia',
                        attributes: ['fiscalia']
                    },
                    {
                        model: Puesto,
                        as: 'puesto',
                        attributes: ['puesto']
                    }
                ],
                attributes: ['nombre', 'apellido']
            },
            {
                model: Usuario,
                as: 'usuario_aprobo_expediente',
                include: [
                    {
                        model: Fiscalia,
                        as: 'fiscalia',
                        attributes: ['fiscalia']
                    },
                    {
                        model: Puesto,
                        as: 'puesto',
                        attributes: ['puesto',]
                    }
                ],
                attributes: ['nombre', 'apellido']
            },
        ],
    };

    let resultado = await Bitacora_expediente.findOne({
        ...combinado
    });

    return success(resultado, successMessages.SUCCESS_FINDALL);


};
