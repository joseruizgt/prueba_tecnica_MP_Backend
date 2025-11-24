const { response, request } = require('express');
const { error } = require('../helpers/respuestas');
const { errorMessages } = require('../messages/es');
const { getList, getItem, saveItem, editItem, deleteItem, getListActive, getListInactive } = require('../services/usuario.service');


exports.getList = async (req = request, res = response) => {
  try {
    const result = await getList(req.query);

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

exports.saveItem = async (req, res = response) => {

  try {
    const result = await saveItem(req.body);
    if (result.valid) {
      res.status(200).json(result);
    } else {
      res.status(200).json(result);
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

exports.deleteItem = async (req, res = response) => {
  try {
    const result = await deleteItem(req.query);
    if (result.valid) {
      res.status(200).json(result);
    } else {
      res.status(300).json(result);
    }
  } catch (e) {
    res.status(500).json(error(errorMessages.ERROR_ADD, e));
  }
};

exports.getListActive = async (req = request, res = response) => {
  try {
    const result = await getListActive(req.query);

    if (result.valid) {
      res.status(200).json(result);
    } else {
      res.status(300).json(result);
    }

  } catch (e) {
    res.status(500).json(error(errorMessages.ERROR_ADD, e));
  }
};

exports.getListInactive = async (req = request, res = response) => {
  try {
    const result = await getListInactive(req.query);

    if (result.valid) {
      res.status(200).json(result);
    } else {
      res.status(300).json(result);
    }

  } catch (e) {
    res.status(500).json(error(errorMessages.ERROR_ADD, e));
  }
};