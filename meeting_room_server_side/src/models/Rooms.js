const { Model, DataTypes } = require("sequelize");

class Rooms extends Model {
    static init(connection) {
            super.init({
                roomid: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                _name: DataTypes.STRING,
                description: DataTypes.STRING,
                _location: DataTypes.STRING,
                image: DataTypes.STRING,
                seats: DataTypes.INTEGER,
            }, {
                sequelize: connection,
                tableName: "rooms",
                timestamps: false,
            });
        }
        //Relacionamentos
    static associate(models) {
        //1 - N
        this.belongsTo(models.Offices, {
            foreignKey: "officeid",
            as: "office",
        });
        //1 - N
        this.hasMany(models.Reservations, {
            foreignKey: "roomid",
            as: "reservations",
        });
        //N - N
        this.belongsToMany(models.Materials, {
            foreignKey: "roomid",
            through: "roommaterials",
            as: "materials"
        });
    }
}

module.exports = Rooms;