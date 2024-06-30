const { Model, DataTypes } = require("sequelize");

class ExternalRoomCache extends Model {
    static init(connection) {
            super.init({
                roomid: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
                _name: DataTypes.STRING,
                description: DataTypes.STRING,
                _location: DataTypes.STRING,
                image: DataTypes.STRING,
                seats: DataTypes.INTEGER,
            }, {
                sequelize: connection,
                tableName: "externalroomcache",
                timestamps: false,
            });
        }
        //Relacionamentos
    static associate(models) {

        this.belongsTo(models.ExternalOffices, {
            foreignKey: "officeid",
            as: "office",
        });
        //N - N 
        this.belongsToMany(models.Materials, {
            foreignKey: "roomid",
            through: "externalroommaterials",
            as: "materials"
        });
    }
}

module.exports = ExternalRoomCache;