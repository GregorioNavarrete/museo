// models/TipoArticulo.js
module.exports = (sequelize, DataTypes) => {
  const alias = 'TipoArticulo';
  const columns = {
    id_tipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  };
  const config = {
    tableName: 'TiposArticulo',
    timestamps: false
  };

  const TipoArticulo = sequelize.define(alias, columns, config);

  TipoArticulo.associate = function(models) {
    TipoArticulo.hasMany(models.Articulo, {
      as: 'articulos',
      foreignKey: 'id_tipo'
    });
  };

  return TipoArticulo;
};
