const { response, request } = require('express');
const { error } = require('../helpers/respuestas');
const { errorMessages } = require('../messages/es');
const { getList, getItem, saveItem, editItem, deleteItem, getListForPermissions, saveRolPermissions, deleteRolPermissions } = require('../services/rol.service');


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

exports.saveItem = async (req, res = response) => {

  try {
    const result = await saveItem(req.body);
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

exports.getListForPermissions = async (req = request, res = response) => {
  try {
    const result = await getListForPermissions(req.query);

    if (result.valid) {
      res.status(200).json(result);
    } else {
      res.status(300).json(result);
    }

  } catch (e) {
    res.status(500).json(error(errorMessages.ERROR_ADD, e));
  }
};

exports.saveRolPermissions = async (req, res = response) => {

  try {
    const result = await saveRolPermissions(req.query, req.body);
    if (result.valid) {
      res.status(200).json(result);
    } else {
      res.status(300).json(result);
    }
  } catch (e) {
    res.status(500).json(error(errorMessages.ERROR_ADD, e));
  }
};

exports.deleteRolPermissions = async (req, res = response) => {

  try {
    const result = await deleteRolPermissions(req.query, req.body);
    if (result.valid) {
      res.status(200).json(result);
    } else {
      res.status(300).json(result);
    }
  } catch (e) {
    res.status(500).json(error(errorMessages.ERROR_ADD, e));
  }
};
