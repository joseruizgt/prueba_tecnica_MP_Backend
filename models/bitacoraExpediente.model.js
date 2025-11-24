/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('bitacora_expediente', {
        idBitacoraExpediente: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: 'id_bitacora_expediente'
        },
        id_expediente: {
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
        fecha_eliminado: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'bitacora_expediente',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'id_bitacora_expediente' },
                ]
            }
        ]
    });
};
