const express = require("express");
const routes = express.Router();
const Rooms = require("./controllers/Room")
const Offices = require("./controllers/Office")
const Reservation = require("./controllers/Reservation")

routes.get("/api/external-office/rooms",Rooms.getRoomsFromOffice);
routes.get("/api/external-office/",Offices.getOffices);
routes.post("/api/external-office/free-rooms",Rooms.getFreeRoomsFromOffice);
routes.post("/api/external-office/reserve",Reservation.reserve);
routes.get("/api/external-office/delete",Reservation.deleteReserve)
routes.post("/api/external-office/listUsersReservations",Reservation.lastUserReseves)
routes.get("/api/external-office/listReservationsByRoomDate",Reservation.getReservationsByDay);

module.exports = routes;