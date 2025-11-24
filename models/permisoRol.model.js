module.exports = function (sequelize, DataTypes) {
    return sequelize.define('permiso_rol', {
        idPermisoRol: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: 'id_permiso_rol'
        },
        idPermiso: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'permiso',
                key: 'id_permiso'
            },
            unique: 'permiso_rol_permiso_FK',
            field: 'id_permiso'
        },
        // id_permiso: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        idRol: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rol',
                key: 'id_rol'
            },
            unique: 'permiso_rol_rol_FK',
            field: 'id_rol'
        },
        // id_rol: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
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
        tableName: 'permiso_rol',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'id_permiso_rol' },
                ]
            },
            {
                name: 'permiso_rol_permiso_FK',
                using: 'BTREE',
                fields: [
                    { name: 'id_permiso' },
                ]
            },
            {
                name: 'permiso_rol_rol_FK',
                using: 'BTREE',
                fields: [
                    { name: 'id_rol' },
                ]
            }
        ]
    });
};
