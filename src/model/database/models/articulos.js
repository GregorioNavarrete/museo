// models/Articulo.js
module.exports = (sequelize, DataTypes) => {
  const alias = 'Articulo';
  const columns = {
    id_articulo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_tipo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    creado: {
      type: DataTypes.DATE,
      allowNull: true
    }
  };
  const config = {
    tableName: 'Articulos',
    timestamps: false
  };

  const Articulo = sequelize.define(alias, columns, config);

  Articulo.associate = function(models) {
    // Articulo pertenece a TipoArticulo
    Articulo.belongsTo(models.TipoArticulo, {
      as: 'tipo',
      foreignKey: 'id_tipo'
    });

    // 1:1 con tablas específicas
    Articulo.hasOne(models.Moto, {
      as: 'moto',
      foreignKey: 'id_articulo'
    });

    Articulo.hasOne(models.MaquinaCoser, {
      as: 'maquinaCoser',
      foreignKey: 'id_articulo'
    });

    Articulo.hasOne(models.OtroArticulo, {
      as: 'otro',
      foreignKey: 'id_articulo'
    });

    // Articulo tiene muchos medios (fotos/videos)
    Articulo.hasMany(models.Medio, {
      as: 'medios',
      foreignKey: 'id_articulo'
    });
  };

  return Articulo;
};
