// models/Moto.js
module.exports = (sequelize, DataTypes) => {
  const alias = 'Moto';
  const columns = {
    id_articulo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
      // NO autoIncrement: es PK que referencia Articulos.id_articulo
    },
    modelo: { type: DataTypes.STRING(100), allowNull: true },
    marca: { type: DataTypes.STRING(100), allowNull: true },
    origen: { type: DataTypes.STRING(100), allowNull: true },
    rodado: { type: DataTypes.STRING(50), allowNull: true },
    hp: { type: DataTypes.STRING(50), allowNull: true }, // en SQL era VARCHAR
    motor: { type: DataTypes.STRING(100), allowNull: true },
    descripcion_corta: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra1: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra2: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra3: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra4: { type: DataTypes.STRING(255), allowNull: true },
    campo_extra5: { type: DataTypes.STRING(255), allowNull: true }
  };
  const config = {
    tableName: 'Motos',
    timestamps: false
  };

  const Moto = sequelize.define(alias, columns, config);

  Moto.associate = function(models) {
    // la tabla Motos pertenece a Articulo (1:1) usando la misma PK
    Moto.belongsTo(models.Articulo, {
      as: 'articulo',
      foreignKey: 'id_articulo'
    });
  };

  return Moto;
};
