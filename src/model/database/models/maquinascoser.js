// models/MaquinaCoser.js
module.exports = (sequelize, DataTypes) => {
  const alias = 'MaquinaCoser';
  const columns = {
    id_articulo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    modelo: { type: DataTypes.STRING(100), allowNull: true },
    origen: { type: DataTypes.STRING(100), allowNull: true },
    campo_extra1: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra2: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra3: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra4: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra5: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra6: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra7: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra8: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra9: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra10: { type: DataTypes.STRING(255), allowNull: true }
  };
  const config = {
    tableName: 'MaquinasCoser',
    timestamps: false
  };

  const MaquinaCoser = sequelize.define(alias, columns, config);

  MaquinaCoser.associate = function(models) {
    MaquinaCoser.belongsTo(models.Articulo, {
      as: 'articulo',
      foreignKey: 'id_articulo'
    });
  };

  return MaquinaCoser;
};
