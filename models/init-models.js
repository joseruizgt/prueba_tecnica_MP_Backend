const { sequelize } = require('../utils/sqlserver/sqlserver.config');
const DataTypes = require('sequelize').DataTypes;
const _usuario = require('./usuario.model');
// const _agencia = require('./agencia.model');
const _rol = require('./rol.model');
const _puesto = require('./puesto.model');
// const _vale = require('./vale.model');
// const _rechazo_vale = require('./rechazoVale.model');
// const _bitacora_vale = require('./bitacoraVale.model');
// const _parametrizacion = require('./parametrizacion.model');
// const _bitacora_parametrizacion = require('./bitacoraParametrizacion.model');
const _permiso = require('./permiso.model');
const _permiso_rol = require('./permisoRol.model');
// const _recibo = require('./recibo.model');
// const _rechazo_recibo = require('./rechazoRecibo.model');
// const _bitacora_recibo = require('./bitacoraRecibo.model');
const _control_correlativo = require('./controlCorrelativo.model');
// const _departamento = require('./departamento.model');
// const _proveedor = require('./proveedor.model');
// const _tipo_factura = require('./tipoFactura.model');
// const _orden_pago = require('./ordenPago.model');
// const _rechazo_orden_pago = require('./rechazoOrdenPago.model');
// const _bitacora_orden_pago = require('./bitacoraOrdenPago.model');
const _fiscalia = require('./fiscalia.model');
const _expediente = require('./expediente.model');
const _bitacora_expediente = require('./bitacoraExpediente.model');

function initModels() {
  const usuario = _usuario(sequelize, DataTypes);
  // const agencia = _agencia(sequelize, DataTypes);
  const rol = _rol(sequelize, DataTypes);
  const puesto = _puesto(sequelize, DataTypes);
  // const vale = _vale(sequelize, DataTypes);
  // const rechazo_vale = _rechazo_vale(sequelize, DataTypes);
  // const bitacora_vale = _bitacora_vale(sequelize, DataTypes);
  // const parametrizacion = _parametrizacion(sequelize, DataTypes);
  // const bitacora_parametrizacion = _bitacora_parametrizacion(sequelize, DataTypes);
  const permiso = _permiso(sequelize, DataTypes);
  const permiso_rol = _permiso_rol(sequelize, DataTypes);
  // const recibo = _recibo(sequelize, DataTypes);
  // const rechazo_recibo = _rechazo_recibo(sequelize, DataTypes);
  // const bitacora_recibo = _bitacora_recibo(sequelize, DataTypes);
  const control_correlativo = _control_correlativo(sequelize, DataTypes);
  // const departamento = _departamento(sequelize, DataTypes);
  // const proveedor = _proveedor(sequelize, DataTypes);
  // const tipo_factura = _tipo_factura(sequelize, DataTypes);
  // const orden_pago = _orden_pago(sequelize, DataTypes);
  // const rechazo_orden_pago = _rechazo_orden_pago(sequelize, DataTypes);
  // const bitacora_orden_pago = _bitacora_orden_pago(sequelize, DataTypes);
  const fiscalia = _fiscalia(sequelize, DataTypes);
  const expediente = _expediente(sequelize, DataTypes);
  const bitacora_expediente = _bitacora_expediente(sequelize, DataTypes);

  //CREAR RELACIONES ENTRE LAS ENTIDADES

  //Usuario - Rol
  usuario.belongsTo(rol, { foreignKey: "idRol" });
  rol.hasMany(usuario, { foreignKey: "idRol" });

  //Usuario - Agencia
  // usuario.belongsTo(agencia, { foreignKey: "idAgencia", as: 'agencia' });
  // agencia.hasMany(usuario, { foreignKey: "idAgencia" });

  //Usuario - Fiscalia
  usuario.belongsTo(fiscalia, { foreignKey: "idFiscalia", as: 'fiscalia' });
  fiscalia.hasMany(usuario, { foreignKey: "idFiscalia" });

  //Usuario - Puesto
  usuario.belongsTo(puesto, { foreignKey: "idPuesto", as: 'puesto' });
  puesto.hasMany(usuario, { foreignKey: "idPuesto" });

  // //Usuario - jefeAprueba
  // usuario.belongsTo(usuario, { foreignKey: "idJefeAprueba", as: 'jefeAprueba' });
  // usuario.hasMany(usuario, { foreignKey: "idUsuario" });

  // //Usuario - jefeAutoriza
  // usuario.belongsTo(usuario, { foreignKey: "idJefeAutoriza", as: 'jefeAutoriza' });
  // usuario.hasMany(usuario, { foreignKey: "idUsuario" });

  //Vale - Usuario
  // vale.belongsTo(usuario, { foreignKey: "idUsuario" });
  // usuario.hasMany(vale, { foreignKey: "idUsuario" });

  //Expediente - Usuario
  expediente.belongsTo(usuario, { foreignKey: "idUsuario", as: 'expediente_usuario' });
  usuario.hasMany(expediente, { foreignKey: "idUsuario" });

  //Fiscalia - Usuario
  expediente.belongsTo(fiscalia, { foreignKey: "idFiscalia" });
  fiscalia.hasMany(expediente, { foreignKey: "idFiscalia" });

  // //Rechazo Vale - Usuario
  // rechazo_vale.belongsTo(usuario, { foreignKey: "idUsuario" });
  // usuario.hasMany(rechazo_vale, { foreignKey: "idUsuario" });

  //Rechazo Vale - vale
  // rechazo_vale.belongsTo(vale, { foreignKey: "idVale" });
  // vale.hasMany(rechazo_vale, { foreignKey: "idVale" });

  //Bitacora vale - vale
  // bitacora_vale.belongsTo(vale, { foreignKey: "id_vale" });
  // vale.hasMany(bitacora_vale, { foreignKey: "id_vale" });

  // //Bitacora vale - usuario que creo
  // bitacora_vale.belongsTo(usuario, { foreignKey: "creacion", as: 'usuario_creo' });
  // usuario.hasMany(bitacora_vale, { foreignKey: "creacion" });

  // //Bitacora vale - usuario que aprobo
  // bitacora_vale.belongsTo(usuario, { foreignKey: "aprobacion", as: 'usuario_aprobo' });
  // usuario.hasMany(bitacora_vale, { foreignKey: "aprobacion" });

  // //Bitacora vale - usuario que autorizo
  // bitacora_vale.belongsTo(usuario, { foreignKey: "autorizacion", as: 'usuario_autorizo' });
  // usuario.hasMany(bitacora_vale, { foreignKey: "autorizacion" });

  // //Bitacora vale - usuario que desembolso
  // bitacora_vale.belongsTo(usuario, { foreignKey: "desembolso", as: 'usuario_desembolso' });
  // usuario.hasMany(bitacora_vale, { foreignKey: "desembolso" });

  // //Bitacora vale - usuario que finalizo
  // bitacora_vale.belongsTo(usuario, { foreignKey: "finalizado", as: 'usuario_finalizo' });
  // usuario.hasMany(bitacora_vale, { foreignKey: "finalizado" });

  // //Parametrizacion - usuario
  // parametrizacion.belongsTo(usuario, { foreignKey: "idUsuario", as: 'usuario' });
  // usuario.hasMany(parametrizacion, { foreignKey: "idUsuario" });

  // //Bitacora parametrizacion - vale
  // bitacora_parametrizacion.belongsTo(vale, { foreignKey: "id_vale", as: 'vale' });
  // vale.hasMany(bitacora_parametrizacion, { foreignKey: "id_vale" });

  // //Bitacora parametrizacion - parametrizacion
  // bitacora_parametrizacion.belongsTo(parametrizacion, { foreignKey: "id_parametrizacion", as: 'parametrizacion' });
  // parametrizacion.hasMany(bitacora_parametrizacion, { foreignKey: "id_parametrizacion" });

  //Permisos por rol - permisos
  permiso_rol.belongsTo(permiso, { foreignKey: "idPermiso", as: 'permiso' });
  permiso.hasMany(permiso_rol, { foreignKey: "idPermiso" });

  //Permisos por rol - rol
  permiso_rol.belongsTo(rol, { foreignKey: "id_rol", as: 'rolpermisos' });
  rol.hasMany(permiso_rol, { foreignKey: "id_rol" });

  // //Recibo - Usuario
  // recibo.belongsTo(usuario, { foreignKey: "idUsuario" });
  // usuario.hasMany(recibo, { foreignKey: "idUsuario" });

  // //Rechazo Recibo - Usuario
  // rechazo_recibo.belongsTo(usuario, { foreignKey: "idUsuario" });
  // usuario.hasMany(rechazo_recibo, { foreignKey: "idUsuario" });

  // //Rechazo Recibo - Recibo
  // rechazo_recibo.belongsTo(recibo, { foreignKey: "idRecibo" });
  // recibo.hasMany(rechazo_recibo, { foreignKey: "idRecibo" });

  // //Bitacora recibo - recibo
  // bitacora_recibo.belongsTo(recibo, { foreignKey: "id_recibo" });
  // recibo.hasMany(bitacora_recibo, { foreignKey: "id_recibo" });

  // //Bitacora recibo - usuario que creo
  // bitacora_recibo.belongsTo(usuario, { foreignKey: "creacion", as: 'usuario_creo_recibo' });
  // usuario.hasMany(bitacora_recibo, { foreignKey: "creacion" });

  // //Bitacora recibo - usuario que aprobo
  // bitacora_recibo.belongsTo(usuario, { foreignKey: "aprobacion", as: 'usuario_aprobo_recibo' });
  // usuario.hasMany(bitacora_recibo, { foreignKey: "aprobacion" });

  // //Bitacora recibo - usuario que autorizo
  // bitacora_recibo.belongsTo(usuario, { foreignKey: "autorizacion", as: 'usuario_autorizo_recibo' });
  // usuario.hasMany(bitacora_recibo, { foreignKey: "autorizacion" });

  // //proveedor - departamento
  // proveedor.belongsTo(departamento, { foreignKey: "idDepartamento" });
  // departamento.hasMany(proveedor, { foreignKey: "idDepartamento" });

  // //orden de pago - usuario
  // orden_pago.belongsTo(usuario, { foreignKey: "idUsuario" });
  // usuario.hasMany(orden_pago, { foreignKey: "idUsuario" });

  // //orden de pago - tipo factura
  // orden_pago.belongsTo(tipo_factura, { foreignKey: "idTipoFactura" });
  // tipo_factura.hasMany(orden_pago, { foreignKey: "idTipoFactura" });

  // //orden de pago - proveedor
  // orden_pago.belongsTo(proveedor, { foreignKey: "idProveedor" });
  // proveedor.hasMany(orden_pago, { foreignKey: "idProveedor" });

  // //rechazo orden de pago - usuario
  // rechazo_orden_pago.belongsTo(usuario, { foreignKey: "idUsuario" });
  // usuario.hasMany(rechazo_orden_pago, { foreignKey: "idUsuario" });

  // //rechazo orden de pago - orden de pago
  // rechazo_orden_pago.belongsTo(orden_pago, { foreignKey: "idOrdenPago" });
  // orden_pago.hasMany(rechazo_orden_pago, { foreignKey: "idOrdenPago" });

  // //Bitacora orden de pago - orden de pago
  // bitacora_orden_pago.belongsTo(orden_pago, { foreignKey: "id_orden_pago" });
  // orden_pago.hasMany(bitacora_orden_pago, { foreignKey: "id_orden_pago" });




  //Bitacora expediente - expediente
  bitacora_expediente.belongsTo(expediente, { foreignKey: "id_expediente" });
  expediente.hasMany(bitacora_expediente, { foreignKey: "id_expediente" });

  //Bitacora expediente - usuario que creo
  bitacora_expediente.belongsTo(usuario, { foreignKey: "creacion", as: 'usuario_creo_expediente' });
  usuario.hasMany(bitacora_expediente, { foreignKey: "creacion" });

  //Bitacora expediente - usuario que aprobo
  bitacora_expediente.belongsTo(usuario, { foreignKey: "aprobacion", as: 'usuario_aprobo_expediente' });
  usuario.hasMany(bitacora_expediente, { foreignKey: "aprobacion" });


  return {
    Usuario: usuario,
    // Agencia: agencia,
    Rol: rol,
    Puesto: puesto,
    // Vale: vale,
    // Rechazo_vale: rechazo_vale,
    // Bitacora_vale: bitacora_vale,
    // Parametrizacion: parametrizacion,
    // Bitacora_parametrizacion: bitacora_parametrizacion,
    Permiso: permiso,
    Permiso_rol: permiso_rol,
    // Recibo: recibo,
    // Rechazo_recibo: rechazo_recibo,
    // Bitacora_recibo: bitacora_recibo,
    Control_correlativo: control_correlativo,
    // Departamento: departamento,
    // Proveedor: proveedor,
    // Tipo_factura: tipo_factura,
    // Orden_pago: orden_pago,
    // Rechazo_orden_pago: rechazo_orden_pago,
    // Bitacora_orden_pago: bitacora_orden_pago,
    Fiscalia: fiscalia,
    Expediente: expediente,
    Bitacora_expediente: bitacora_expediente,
  };
}
module.exports = { ...initModels() };
