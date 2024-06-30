const { Model, DataTypes } = require("sequelize");

//Class a tabela da bd
class Offices extends Model {
  static init(connection) {
    super.init(
      {
        officeid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        description: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize: connection,
        tableName: "offices",
        timestamps: false,
      }
    );
  }

  //Relacionamento 1 para muitos
  static associate(models) {
    this.hasMany(models.Rooms, { foreignKey: "officeid", as: "RL_Rooms" });
    this.hasMany(models.Users, { foreignKey: "officeid", as: "Rooms" });
  }
}

module.exports = Offices;
