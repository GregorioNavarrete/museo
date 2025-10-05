// models/Medio.js
module.exports = (sequelize, DataTypes) => {
  const alias = 'Medio';
  const columns = {
    id_medio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_articulo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: { type: DataTypes.STRING(50), allowNull: false }, // 'foto' | 'video'
    url: { type: DataTypes.STRING(1000), allowNull: false },
    titulo: { type: DataTypes.STRING(250), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    duracion_segundos: { type: DataTypes.INTEGER, allowNull: true },
    orden: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    creado: { type: DataTypes.DATE, allowNull: true },
    metadata: { type: DataTypes.JSON, allowNull: true }
  };
  const config = {
    tableName: 'Medios',
    timestamps: false
  };

  const Medio = sequelize.define(alias, columns, config);

  Medio.associate = function(models) {
    Medio.belongsTo(models.Articulo, {
      as: 'articulo',
      foreignKey: 'id_articulo'
    });
  };

  return Medio;
};
