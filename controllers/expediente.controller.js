const { response, request } = require('express');
const { error } = require('../helpers/respuestas');
const { errorMessages } = require('../messages/es');
const { getList, saveItem, editItem, cambioFase, getItem, correccionExpediente, deleteItem, getBitacoraIndividual } = require('../services/expediente.service');


exports.getList = async (req = request, res = response) => {
    try {
        const result = await getList(req);

        if (result.valid) {
            res.status(200).json(result);
        } else {
            res.status(300).json(result);
        }
    } catch (e) {
        res.status(500).json(error(errorMessages.ERROR_FINDALL, e));
    }
};

exports.saveItem = async (req, res = response) => {

    try {
        const result = await saveItem(req);
        if (result.valid) {
            res.status(200).json(result);
        } else {
            res.status(300).json(result);
        }
    } catch (e) {
        res.status(500).json(error(errorMessages.ERROR_ADD, e));
    }
};

exports.editItem = async (req, res = response) => {
    try {
        const result = await editItem(req.query, req.body);
        if (result.valid) {
            res.status(200).json(result);
        } else {
            res.status(300).json(result);
        }
    } catch (e) {
        res.status(500).json(error(errorMessages.ERROR_ADD, e));
    }
};

exports.cambioFase = async (req, res = response) => {
    try {
        const result = await cambioFase(req.query, req.body, req);
        if (result.valid) {
            res.status(200).json(result);
        } else {
            res.status(300).json(result);
        }
    } catch (e) {
        res.status(500).json(error(errorMessages.ERROR_ADD, e));
    }
};

exports.getItem = async (req = request, res = response) => {
    try {
        const resultado = await getItem(req.query);
        if (resultado.valid) {
            res.status(200).json(resultado);
        } else {
            res.status(300).json(resultado);
        }
    } catch (e) {
        res.status(500).json(error(errorMessages.ERROR_ADD, e));
    }
};

exports.correccionExpediente = async (req = request, res = response) => {
    try {
        const resultado = await correccionExpediente(req);
        if (resultado.valid) {
            res.status(200).json(resultado);
        } else {
            res.status(300).json(resultado);
        }
    } catch (e) {
        res.status(500).json(error(errorMessages.ERROR_ADD, e));
    }
}

exports.deleteItem = async (req, res = response) => {
    try {
        const result = await deleteItem(req.query, req);
        if (result.valid) {
            res.status(200).json(result);
        } else {
            res.status(300).json(result);
        }
    } catch (e) {
        res.status(500).json(error(errorMessages.ERROR_ADD, e));
    }
};

exports.getBitacoraIndividual = async (req = request, res = response) => {
    try {
        const result = await getBitacoraIndividual(req);

        if (result.valid) {
            res.status(200).json(result);
        } else {
            res.status(300).json(result);
        }
    } catch (e) {
        res.status(500).json(error(errorMessages.ERROR_FINDALL, e));
    }
};