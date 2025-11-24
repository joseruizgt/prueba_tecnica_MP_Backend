/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('bitacora_recibo', {
        idBitacoraRecibo: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: 'id_bitacora_recibo'
        },
        id_recibo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        creacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        aprobacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        autorizacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        eliminado: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        fecha_creacion: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fecha_aprobacion: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fecha_autorizacion: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fecha_eliminado: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'bitacora_recibo',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'id_bitacora_recibo' },
                ]
            }
        ]
    });
};
