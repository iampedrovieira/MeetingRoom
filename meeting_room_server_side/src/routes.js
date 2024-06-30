const express = require("express");
const officesController = require("./controllers/OfficesController");
const usersController = require("./controllers/UsersController");
const reservationsController = require("./controllers/ReservationsController");
const roomsController = require("./controllers/RoomsController");
const materialsController = require("./controllers/MaterialsController");

const routes = express.Router();

routes.get("/api/user/iadata", reservationsController.listRoomsToIA);

//Users routes
routes.post("/api/user/login", usersController.loginValidation);
routes.post("/api/user/session", usersController.sessionValidation);
routes.post("/api/user/change-office", usersController.changeSessionOffice);
// routes.post("/api/user/userLevel", usersController.userLevel);

// Rooms routes
routes.get("/api/rooms/list", roomsController.listRooms);
routes.post("/api/rooms/listByOffice", roomsController.listRoomsByOffice);
routes.post("/api/rooms/free-rooms", roomsController.listFreeRooms);

// Reservations routes
routes.get("/api/reservations/list", reservationsController.listReservations);
routes.get(
  "/api/reservations/cancel",
  reservationsController.cancelReservation
);
routes.post(
  "/api/reservations/finish",
  reservationsController.finishReservation
);
routes.post(
  "/api/reservations/reservationstomodel",
  reservationsController.reservationsToModel
);
routes.post(
  "/api/reservations/levelsLastReservations",
  reservationsController.levelsLastReservations
);

//routes.post("/api/reservations/listbyRoom", reservationsController.listReservationsByRoom);
routes.get(
  "/api/reservations/listRoomDate",
  reservationsController.listReservationsRoomDate
);
routes.post(
  "/api/reservations/listUsersReservations",
  reservationsController.listUsersReservations
);
routes.post(
  "/api/reservations/create",
  reservationsController.createReservations
);

//Offices routes
routes.get("/api/offices/list", officesController.listarOffices);

//Materials routes
routes.get("/api/materials/list", materialsController.listMaterials);

module.exports = routes;
