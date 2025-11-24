const { response, request } = require('express');
const { error } = require('../helpers/respuestas');
const { errorMessages, generalMessages } = require('../messages/es');
const { obtenerCorrelativo } = require('../services/controlCorrelativo.service');
const { dateManagement } = require('../helpers/generalServices');


exports.obtenerCorrelativo = async (req = request, res = response) => {
    try {
        const result = await obtenerCorrelativo({...dateManagement()}, generalMessages.VALE);
        if (result.valid) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (e) {
        res.status(500).json(error(errorMessages.ERROR_FINDALL, e));
    }
}