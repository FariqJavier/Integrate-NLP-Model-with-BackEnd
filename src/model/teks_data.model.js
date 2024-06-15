const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/connect');

class TeksData extends Model {}

TeksData.init(
  {
    teks_data_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    teks: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  },
  {
    sequelize,
    tableName: 'teks_data',
    timestamps: false // Jika Anda ingin menggunakan timestamps yang sudah ada di tabel, atur ke true
  }
);

module.exports = TeksData;