const moment = require("moment");

/**
 * Genera la fecha actual en formato YYYY-MM-DD HH:mm:ss lo cual se utiliza
 * para inserciones a la base de datos entre otras actividades
 * @param {*} format
 */
module.exports.generateDateNow = (format = "YYYY-MM-DD HH:mm:ss") =>
    moment(new Date(), "MM-DD-YYYY HH:mm:ss").local().format(format);

/**
 * retorna la data añadiendo campos inmutables como fecha de creación, estado y borrado
 * @param {*} data
 */
module.exports.postFields = (data) => {
    //datos que no pueden cambiar
    data.fecha_creacion = this.generateDateNow();
    data.estado = 1;
    data.borrado = 0;
    return data;
};

/**
 * retorna la data añadiendo campos inmutables como fecha de actualizacion
 * @param {*} data
 */
module.exports.putFields = (data) => {
    //datos que no pueden cambiar
    data.fecha_actualiza = this.generateDateNow();
    return data;
};

/**
 * retorna la data añadiendo campos inmutables como fecha de eliminacion, estado y borrado
 * @param {*} data
 */
module.exports.deleteFields = () => {
    //datos que no pueden cambiar
    let data = {
        fecha_borrado: this.generateDateNow(),
        estado: 0,
        borrado: 1
    }
    return data;
};

/**
 * Funcion para el manejo de paginacion de registros
 * Retorna valores como el limit, offset y page
 * @param {*} limite
 * @param {*} pagina
 */
module.exports.paginationManagement = (limite, pagina, busqueda) => {
    limite = Number.parseInt(limite);
    pagina = pagina !== '0' ? Number.parseInt(pagina) : 0;

    return {
        limit: pagina !== 0 ? limite : undefined,
        offset: pagina !== 0 ? limite * (pagina - 1) : undefined,
        page: pagina
    }
}

module.exports.dateManagement = () => {
    let year = new Date().getFullYear(); //anio actual
    let month = String(new Date().getMonth() + 1).padStart(2, '0'); // mes actual
    let day = String(new Date().getDate()).padStart(2, '0'); // dia actual
    let startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)); // Primer día del año en UTC
    let endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); // Último día del año en UTC

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    return {
        year,
        month,
        day,
        firstDateYear: formattedStartDate,
        endDateYear: formattedEndDate
    }
}