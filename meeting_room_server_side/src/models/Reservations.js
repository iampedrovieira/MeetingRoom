const { Model, DataTypes } = require("sequelize");

class Reservations extends Model {
    static init(connection) {
        super.init({
            reservationid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            initdate: {
                type: DataTypes.DATE,
            },
            enddate: {
                type: DataTypes.DATE,
            },
            isreserved: {
                type: DataTypes.BOOLEAN,
            },
            externalid: {
                type: DataTypes.STRING,
            },
        }, {
            sequelize: connection,
            tableName: "reservations",
            timestamps: false,
        });
    }

    //Relationship
    static associate(models) {
        //Rooms
        this.belongsTo(models.Rooms, { foreignKey: "roomid", as: "room" });
        this.belongsTo(models.Users, { foreignKey: "userid", as: "user" });
    }
}

module.exports = Reservations;