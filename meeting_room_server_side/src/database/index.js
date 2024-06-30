//DataBase connection

const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const Rooms = require("../models/Rooms");
const ExternalRoomCache = require("../models/ExternalRoomCache");
const Offices = require("../models/Offices");
const ExternalOffices = require("../models/ExternalOffices");
const Users = require("../models/Users");
const Reservations = require("../models/Reservations");
const Materials = require("../models/Materials");

const connection = new Sequelize(dbConfig);

Rooms.init(connection);
ExternalRoomCache.init(connection);
Offices.init(connection);
ExternalOffices.init(connection);
Users.init(connection);
Reservations.init(connection);
Materials.init(connection);

Rooms.associate(connection.models);
ExternalRoomCache.associate(connection.models);
Offices.associate(connection.models);
ExternalOffices.associate(connection.models);
Users.associate(connection.models);
Reservations.associate(connection.models);
Materials.associate(connection.models);

module.exports = connection;