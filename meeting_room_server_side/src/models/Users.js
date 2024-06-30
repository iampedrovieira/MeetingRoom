const { Model, DataTypes } = require("sequelize");

//Model corresponding to data base table users
class Users extends Model {
    static init(connection) {
        super.init({
            userid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            _name: {
                type: DataTypes.STRING,
            },
            _level: {
                type: DataTypes.INTEGER,
            },
            username: {
                type: DataTypes.STRING,
            },
            _password: {
                type: DataTypes.STRING,
            },
        }, {
            sequelize: connection,
            tableName: "users",
            timestamps: false,
        });
    }

    //Relationship
    static associate(models) {
        //Offices
        this.belongsTo(models.Offices, { foreignKey: "officeid", as: "Office" });
        //Reservations
        this.hasMany(models.Reservations, {
            foreignKey: "userid",
            as: "reservations",
        });
    }
}

module.exports = Users;