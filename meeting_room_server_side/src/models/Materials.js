const { Model, DataTypes } = require("sequelize");

//Class a tabela da bd
class Materials extends Model {
    static init(connection) {
        super.init({
            materialid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            _name: DataTypes.STRING,
            description: DataTypes.STRING,
        }, {
            sequelize: connection,
            tableName: "materials",
            timestamps: false,

        });
    }

    //N - N
    static associate(models) {
        this.belongsToMany(models.ExternalRoomCache, {
            foreignKey: "materialid",
            through: "externalroommaterials",
            as: 'rooms_'
        });
        this.belongsToMany(models.Rooms, {
            foreignKey: "materialid",
            through: "roommaterials",
            as: 'rooms'
        });
    }
}

module.exports = Materials;