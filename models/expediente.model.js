/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('expediente', {
        idExpediente: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: 'id_expediente'
        },
        correlativo: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fase: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        delito: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        descripcion: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        flag_rechazo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        motivo_rechazo: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fecha_creacion: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fecha_actualiza: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fecha_borrado: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fecha_aprobado: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id_usuario'
            },
            unique: 'expediente_usuario_FK',
            field: 'id_usuario'
        },
        idFiscalia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'fiscalia',
                key: 'id_fiscalia'
            },
            unique: 'expediente_fiscalia_FK',
            field: 'id_fiscalia'
        },
    }, {
        sequelize,
        tableName: 'expediente',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'id_expediente' },
                ]
            },
            {
                name: 'expediente_usuario_FK',
                using: 'BTREE',
                fields: [
                    { name: 'id_usuario' },
                ]
            },
            {
                name: 'expediente_fiscalia_FK',
                using: 'BTREE',
                fields: [
                    { name: 'id_fiscalia' },
                ]
            },
        ]
    });
};
