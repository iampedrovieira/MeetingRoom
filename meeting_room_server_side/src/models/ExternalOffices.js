const { Model, DataTypes } = require("sequelize");

//Class a tabela da bd
class ExternalOffices extends Model {
  static init(connection) {
    super.init(
      {
        officeid: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        description: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize: connection,
        tableName: "externaloffices",
        timestamps: false,
      }
    );
  }

  //Relacionamento 1 para muitos
  static associate(models) {
    this.hasMany(models.ExternalRoomCache, { foreignKey: "officeid", as: "RL_Rooms" });
  }
}

module.exports = ExternalOffices;
