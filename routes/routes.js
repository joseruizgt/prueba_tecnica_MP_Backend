const { Router } = require('express');
const router = Router();

const { validarJWT } = require('../middlewares/validarJWT');

const auth = require('../controllers/auth.controller');
const usuario = require('../controllers/usuario.controller');
const fiscalia = require('../controllers/fiscalia.controller');
const rol = require('../controllers/rol.controller');
const puesto = require('../controllers/puesto.controller');
const permiso = require('../controllers/permiso.controller');
const permisosRol = require('../controllers/permisoRol.controller');
const controlCorrelativo = require('../controllers/controlCorrelativo.controller');
const expediente = require('../controllers/expediente.controller');

// LOGIN
router.post('/login', auth.login);

// LOGOUT
router.post('/logout', auth.logout);

// REFRESH TOKEN
router.post('/auth/refresh-token', auth.refreshToken);

// USUARIO
router.get('/usuario', validarJWT, usuario.getList);
router.get('/usuario/individual', validarJWT, usuario.getItem);
router.post('/usuario', validarJWT, usuario.saveItem);
router.put('/usuario', validarJWT, usuario.editItem);
router.delete('/usuario', validarJWT, [/*validarJWT, esAdminRole, tieneRole('ADMIN_ROLE', 'VENTAR_ROLE', 'OTRO_ROLE')*/], usuario.deleteItem);
router.get('/usuario/activos', validarJWT, usuario.getListActive);
router.get('/usuario/inactivos', validarJWT, usuario.getListInactive);

// Fiscalia
router.get('/fiscalia', fiscalia.getListFiscalia);
router.post('/fiscalia', fiscalia.saveItem);
router.put('/fiscalia', fiscalia.editItem);
router.delete('/fiscalia', fiscalia.deleteItem);

// ROL
router.get('/rol', rol.getList);
router.post('/rol', rol.saveItem);
router.put('/rol', rol.editItem);
router.delete('/rol', rol.deleteItem);
router.get('/rol/lista-permisos', validarJWT, rol.getListForPermissions);
router.post('/rol/lista-permisos', validarJWT, rol.saveRolPermissions);
router.put('/rol/lista-permisos', validarJWT, rol.deleteRolPermissions);

// PUESTO
router.get('/puesto', puesto.getList);
router.post('/puesto', puesto.saveItem);
router.put('/puesto', puesto.editItem);
router.delete('/puesto', puesto.deleteItem);

// EXPEDIENTE
router.get('/expediente', validarJWT, expediente.getList);
router.post('/expediente', validarJWT, expediente.saveItem);
router.put('/expediente', validarJWT, expediente.editItem);
router.post('/expediente/fase', validarJWT, expediente.cambioFase);
router.get('/expediente/individual', validarJWT, expediente.getItem);
router.put('/expediente/correccion', validarJWT, expediente.correccionExpediente);
router.delete('/expediente', validarJWT, expediente.deleteItem);
router.get('/expediente/bitacora/individual', validarJWT, expediente.getBitacoraIndividual);


// PERMISOS
router.get('/permiso', permiso.getList);
router.post('/permiso', validarJWT, permiso.saveItem);
router.put('/permiso', validarJWT, permiso.editItem);
router.delete('/permiso', validarJWT, permiso.deleteItem);

// PERMISOS POR ROL
router.post('/permiso/rol', validarJWT, permisosRol.saveItem);


// CONTROL CORRELATIVO
router.get('/controlCorrelativo', controlCorrelativo.obtenerCorrelativo);



module.exports = router;