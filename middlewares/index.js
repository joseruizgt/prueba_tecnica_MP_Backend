const validaCampos = require('../middlewares/validarCampos');
const validarJWT = require('../middlewares/validarJWT');
const validaRoles = require('../middlewares/validarRoles');

module.exports = {
  ...validaCampos,
  ...validarJWT,
  ...validaRoles
};
