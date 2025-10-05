// models/OtroArticulo.js
module.exports = (sequelize, DataTypes) => {
  const alias = 'OtroArticulo';
  const columns = {
    id_articulo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    campo_extra1: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra2: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra3: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra4: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra5: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra6: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra7: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra8: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra9: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra10: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra11: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra12: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra13: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra14: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra15: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra16: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra17: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra18: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra19: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra20: { type: DataTypes.STRING(255), allowNull: true }
  };
  const config = {
    tableName: 'OtrosArticulos',
    timestamps: false
  };

  const OtroArticulo = sequelize.define(alias, columns, config);

  OtroArticulo.associate = function(models) {
    OtroArticulo.belongsTo(models.Articulo, {
      as: 'articulo',
      foreignKey: 'id_articulo'
    });
  };

  return OtroArticulo;
};
