const { validationResult } = require('express-validator');
const { error } = require('../helpers/respuestas');
const { errorMessages } = require('../messages/es');

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(error(errorMessages.ERROR_VALIDACION, errors.errors));
  }
  next();
};

module.exports = {
  validarCampos
};
