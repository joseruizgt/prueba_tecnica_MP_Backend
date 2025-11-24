/**
 * Retorna un objeto con la estructura de respuesta estandarizada de un error.
 * No incluye el atributo data, por lo que unicamente muestra un mensaje de tipo string, y un valid false
 * @msg: mensaje a mostrar, debe ser de tipo string
 *
 */
module.exports.error = (msg = '', detalle = {}) => {
  return {
    valid: false,
    msg,
    detalle
  };
};

/**
 * Retorna un objeto con la estructura de respuesta estandarizada.
 * Si no se agrega un mensaje, el mismo no se incluirá en el objeto de respuesta
 * @data: objeto de tipo json, el mismo no puede ser un ARRAY. Debe ser un objeto.
 *    Esto con el fin de poder agregar más atributos sin afectar los backends actuales.
 * @msg: mensaje a mostrar, debe ser de tipo string
 * @permision_level: devuelve el nivel de permisos para un usuario en caso existiera
 */
module.exports.success = (data = {}, msg = '', permisionLevel = null) => {
  return {
    valid: true,
    msg,
    data,
    ...(permisionLevel ? { permisionLevel } : {})
  };
};