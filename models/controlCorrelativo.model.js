module.exports = function (sequelize, DataTypes) {
    return sequelize.define('control_correlativo', {
        idControlCorrelativo: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: 'id_control_correlativo'
        },
        numero_correlativo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipo_correlativo: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        anio_correlativo: {
            type: DataTypes.INTEGER,
            allowNull: false
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
    }, {
        sequelize,
        tableName: 'control_correlativo',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'id_control_correlativo' },
                ]
            }
        ]
    });
};
