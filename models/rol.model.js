module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol', {
        idRol: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: 'id_rol'
        },
        rol: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(150),
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
        tableName: 'rol',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'id_rol' },
                ]
            }
        ]
    });
};
