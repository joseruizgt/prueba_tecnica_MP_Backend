/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('usuario', {
    idUsuario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_usuario'
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    usuario: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    contrasenia: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    correo_electronico: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cambio_contrasenia: {
      type: DataTypes.INTEGER,
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
    idRol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rol',
        key: 'id_rol'
      },
      unique: 'usuario_rol_FK',
      field: 'id_rol'
    },
    idFiscalia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fiscalia',
        key: 'id_fiscalia'
      },
      unique: 'usuario_fiscalia_FK',
      field: 'id_fiscalia'
    },
    idPuesto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'puesto',
        key: 'id_puesto'
      },
      unique: 'usuario_puesto_FK',
      field: 'id_puesto'
    },
  }, {
    sequelize,
    tableName: 'usuario',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id_usuario' },
        ]
      },
      {
        name: 'usuario_rol_FK',
        using: 'BTREE',
        fields: [
          { name: 'id_rol' },
        ]
      },
      {
        name: 'usuario_fiscalia_FK',
        using: 'BTREE',
        fields: [
          { name: 'id_fiscalia' },
        ]
      },
      {
        name: 'usuario_puesto_FK',
        using: 'BTREE',
        fields: [
          { name: 'id_puesto' },
        ]
      }
    ]
  });
};
