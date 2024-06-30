const axios = require("axios");

const Reservations = require("../models/Reservations");
const Rooms = require("../models/Rooms");
const { Op, Sequelize, where } = require("sequelize");
const { QueryTypes } = require("sequelize");
const { sequelize, restore } = require("../models/Reservations");
const moment = require("moment");

module.exports = {
  //TEMPORARY
  async listRoomsToIA(req, res) {
    const { userid, officeid, date, startTime, endTime } = req.body;
    try {
      const reservations = await Reservations.findAll({
        where: {
          userid: 16,
          isreserved: true,
        },
        include: [
          {
            association: "room",
            where: {
              officeid: 11,
            },
          },
        ],
        order: [["reservationid", "DESC"]],
        limit: 150,
      });

      if (reservations.length < 100) {
        return res.json({
          message: "Not enough reservations to make a recommendation.",
        });
      } else {
        return res.json(reservations);
      }
    } catch (error) {
      console.log(error);
    }
  },

  async listReservations(req, res) {
    try {
      const reservations = await Reservations.findAll();

      if (reservations.length == 0) {
        return res.json({
          message: "Reservations empty :/",
        });
      } else {
        return res.json(reservations);
      }
    } catch (error) {
      console.log(error);
    }
  },

  async listReservationsRoomDate(req, res) {
    const { roomid, initdate, officeId } = req.query;
    try {
      if(officeId && isNaN(officeId)){
        // To - External
        const domain = officeId.split('-')[1]
        const external_options = {
          method: "GET",
          url: process.env.MATRIX_BOT_API + "/external-office/listReservationsByRoomDate",
          params: {
            roomid:roomid,
            domain:domain,
            initdate,
          },
          timeout: process.env.TIMEOUT_DEFAULT,
        };
        const response_external = await axios.request(external_options);
        var final = []
        for(const item of response_external.data){
          const new_json = {
            officeId,
            internalDomain: process.env.MATRIX_DOMAIN,
            initdate: item.initdate,
            enddate:item.enddate,
            user: item.user,
            reservationid: item.reservationid,
            externalid:item.externalid
          };
          final.push(new_json)
        }
        return res.json(final)
      }else{
        var final = []
        const list = await Reservations.findAll({
          where: {
            roomid: roomid,
            isreserved: true,
            [Op.all]: Sequelize.literal(`Date(initdate) = '${initdate}'`),
          },
          include: [
            {
              association: "user",
            },
          ],
        });
        for(const item of list){
          const new_json = {
            officeId,
            internalDomain: process.env.MATRIX_DOMAIN,
            initdate: item.initdate,
            enddate:item.enddate,
            user: item.user,
            reservationid: item.reservationid,
            externalid:item.externalid
          };
          final.push(new_json)
        }
        return res.json(final)
      }
      
    } catch (error) {
      console.log(error);
    }
  },

  async listUsersReservations(req, res) {
    const { userID, officeid, fromExternal } = req.body;

    const yesterdayDate = moment(new Date(), "YYYY-MM-DDTHH:mm").format("YYYY-MM-DDTHH:mm");  
    try {
      if (fromExternal) {
        // request from external
        const list = await Reservations.findAll({
          where: {
            externalid: userID,
            isreserved: true,
            [Op.all]: Sequelize.literal(`initdate >= '${yesterdayDate}'`),
          },
          include: [
            {
              association: "room",
              where: {
                officeid: officeid,
              },
            },
          ],
          order: [["initdate", "ASC"]],
        });
        var final_json = []
        for (reserve of list) {
          var new_json = {
            enddate: reserve.enddate,
            externalid: reserve.externalid,
            initdate: reserve.initdate,
            isreserved: reserve.isreserved,
            reservationid: reserve.reservationid,
            room: reserve.room,
            userid: reserve.userid,
            officeid:officeid
          }
          final_json.push(new_json)
        }
        return res.json(final_json);

      }
      if (isNaN(officeid) && officeid) {
        //To-External
        const domain = officeid.split('-')[1]
        const externalOffice =officeid.split('-')[0]
        const external_options = {
          method: "POST",
          url: process.env.MATRIX_BOT_API + "/external-office/listUsersReservations",
          headers: { "Content-Type": "application/json" },
          data: {
            userName:userID,
            domain:domain,
            officeid:externalOffice,
          },
          timeout: process.env.TIMEOUT_DEFAULT,
        };
        const response_external = await axios.request(external_options);
        console.log(response_external)
        var final_json=[]
        if (response_external.data) {
          for (reserve of response_external.data) {
            var new_json = {
              enddate: reserve.enddate,
              externalid: reserve.externalid,
              initdate: reserve.initdate,
              isreserved: reserve.isreserved,
              reservationid: reserve.reservationid,
              room: reserve.room,
              userid: reserve.userid,
              officeid:officeid
            }
            final_json.push(new_json)
          }
          return res.json(final_json);
        } else {
          return res.json({ message: "error" });
        }
      } else {
        const list = await Reservations.findAll({
          where: {
            userid: userID,
            isreserved: true,
            [Op.all]: Sequelize.literal(`initdate >= '${yesterdayDate}'`),
          },
          include: [
            {
              association: "room",
              where: {
                officeid: officeid,
              },
            },
          ],
          order: [["initdate", "ASC"]],
        });
        var final_json = []
        for (reserve of list) {
          var new_json = {
            enddate: reserve.enddate,
            externalid: reserve.externalid,
            initdate: reserve.initdate,
            isreserved: reserve.isreserved,
            reservationid: reserve.reservationid,
            room: reserve.room,
            userid: reserve.userid,
            officeid:officeid
          }
          final_json.push(new_json)
        }
        console.log(final_json)
        return res.json(final_json);
      }

    } catch (error) {
      console.log(error);
    }
  },

  async createReservations(req, res) {
    try {
      var {
        date,
        startTime,
        endTime,
        roomID,
        userID,
        level,
        officeID,
        externalID,
        userName
      } = req.body;
      var roomName = "";
      if (isNaN(officeID) && officeID) {
        //External reserve
        if (roomID != -1) {

          const domain = officeID.split("-")[1]
          const options_external = {
            method: 'POST',
            url: process.env.MATRIX_BOT_API + '/external-office/reserve',
            headers: { 'Content-Type': 'application/json' },
            data: {
              date,
              startTime,
              endTime,
              roomID,
              userName: userName,
              domain
            }
          };

          await axios.request(options_external).then(function (response) {
            return res.status(201).json({
              message: "Reservations created",
              roomname: "",
              reservationid: response.data.reservationid
            });
          }).catch(function (error) {
            console.error(error);
            return res.json("Someting Wrong")
          });

        } else {
          return res.status(203).json({
            message: "Please,select a room to reserve outside",
          });
        }
      } else {

       

        const reservation_info = {
          date: date,
          startTime: startTime,
          endTime: endTime,
        };

        if (roomID == -1) {
          // Getting data to send to Pyhton Service
          try {
            // Getting the user's previous reservations
            const search_reservations = {
              userID: userID,
              officeID: officeID,
              level: level,
            };
            const reservations_options = {
              method: "POST",
              url:
                process.env.PUBLIC_BACK_BASEURL +
                "/reservations/reservationstomodel",
              headers: { "Content-Type": "application/json" },
              data: search_reservations,
            };

            const response_reservations = await axios.request(
              reservations_options
            );

            //TODO - dont go if have > 100 reservation [não testei]
            if (response_reservations.data.length < 100) {
              return res.status(203).json({
                message: "Not enough reservations to make a recommendation",
              });
            }

            // Getting the free rooms
            try {
              const json_search = {
                date: date,
                startTime: startTime,
                endTime: endTime,
                officeid: officeID,
              };
              const options_rooms = {
                method: "POST",
                url: process.env.PUBLIC_BACK_BASEURL + "/rooms/free-rooms",
                headers: { "Content-Type": "application/json" },
                data: json_search,
              };

              const response_rooms = await axios.request(options_rooms);
              if (response_rooms.data.length > 0) {
                var freeRooms = response_rooms.data;
                console.log(freeRooms)
              } else {
                return res
                  .status(203)
                  .json({ message: "No free rooms for the time selected" });
              }
            } catch (error) {
              console.log(error);
            }

            // Send to Python service the previous reservations, the free rooms and the new reservation details
            const recommendationData = {
              data: response_reservations.data,
              reserve_input: reservation_info,
              free_rooms: freeRooms,
            };
            const getAIRecommendation = {
              method: "POST",
              url:
                process.env.RECOMENDATION_SYSTEM_URL + "/api/recommender_by_user",
              headers: { "Content-Type": "application/json" },
              data: recommendationData,
              timeout: 10000,
            };

            //TODO - Timeout

            const recommendedRoom = await axios.request(getAIRecommendation);
            if (recommendedRoom.data.roomid == -1) {
              // Erro na recomendacao

              return res
                .status(203)
                .json({ message: "Error getting a recommendation" });
            } else {
              roomID = recommendedRoom.data.roomid;
              /*freeRooms.forEach(element => {
                if (element.roomid == roomID) {
                  console.log(element)
                  roomName = element._name
                  console.log(roomName)
                }
              }); */
              const room_data =  await Rooms.findAll({where:{
                roomid:roomID
              }})
              roomName = room_data[0]._name
            }

            //return res.json(reservations);
          } catch (error) {
            console.log(error)
            return res.status(203).json({
              message:
                "Something is wrong with recomendation system, I can feel it.",
            });
          }
        }

        const startDate = moment(
          date + " " + startTime,
          "MM-DD-YYYY HH:mm"
        ).format("YYYY-MM-DDTHH:mm");
        const endDate = moment(date + " " + endTime, "MM-DD-YYYY HH:mm").format("YYYY-MM-DDTHH:mm");
        const possibleReservations = await Reservations.findAll({
          where: {
            roomid: roomID,
            [Op.or]: [
              {
                [Op.all]: Sequelize.literal(
                  `initdate >= '${startDate}' AND initdate < '${endDate}'`
                ),
              },
              {
                [Op.all]: Sequelize.literal(
                  `enddate >  '${startDate}' AND enddate <='${endDate}'`
                ),
              },
            ],
          },
        });

        if (possibleReservations.length != 0) {
          var isFree = true;

          for (var i = 0; i < possibleReservations.length; i++) {
            if (possibleReservations[i].isreserved) {
              isFree = false;
              break;
            }
          }

          if (!isFree) {
            return res.status(203).json({
              message: "Already exists a reservation",
            });
          }
        }
        console.log()
        if (externalID) {
          //request from external
          const reservation = await Reservations.create({
            initdate: startDate,
            enddate: endDate,
            isreserved: true,
            roomid: roomID,
            userid: userID,
            externalid: externalID,
          });
          if (reservation) {
            console.log(reservation)
            return res.status(201).json({
              message: "Reservations created",
              roomname:"" ,
              reservationid: reservation.reservationid
            });
          }
        } else {
          const reservation = await Reservations.create({
            initdate: startDate,
            enddate: endDate,
            isreserved: true,
            roomid: roomID,
            userid: userID,
            externalid: userName,
          });
          console.log(roomName)
          if (reservation) {
            return res.status(201).json({
              message: "Reservations created",
              roomname: roomName,
              reservationid: reservation.dataValues.reservationid
            });
          }
        }

      }
    } catch (error) {
      console.log(error);
      return res.status(203).json({
        message: "Something is wrong, I can feel it.",
      });
    }
  },

  async cancelReservation(req, res) {
    const { reserveid, userName, officeid } = req.query;
    try {
      if (isNaN(officeid) && officeid) {
        //Delete external
        const domain = officeid.split('-')[1]
        const external_options = {
          method: "GET",
          url: process.env.MATRIX_BOT_API + "/external-office/delete",
          params: { reserveid: reserveid, userName: userName, domain: domain },
          timeout: process.env.TIMEOUT_DEFAULT,
        };
        const response_external = await axios.request(external_options);

        if (response_external.status == 200) {
          return res.json({ message: "sucesso" });
        } else {
          return res.json({ message: "error" });
        }

      } else {
        const edit = await Reservations.update(
          { isreserved: false },
          {
            where: {
              reservationid: reserveid,
            },
          }
        );
        if (edit == 1) {
          return res.json(edit);
        }
        return res.json({ message: "error" });

      }
    } catch (error) {
      console.log(error);
    }
  },

  async finishReservation(req, res) {
    try {
      const { reserveid } = req.body;
      const actualTime = moment().format();

      const edit = await Reservations.update(
        { enddate: actualTime },
        {
          where: {
            reservationid: reserveid,
            [Op.all]: Sequelize.literal(
              `initdate < '${actualTime}' AND enddate > '${actualTime}'`
            ),
          },
        }
      );

      if (edit > 0) {
        return res.json({ message: "success" });
      } else {
        return res.json({ message: "error" });
      }
    } catch (erro) { }
  },

  async reservationsToModel(req, res) {
    var { userID, officeID, level } = req.body;

    try {
      // Getting the users reservations
      const reservationsUser = await Reservations.findAll({
        where: {
          userid: userID, //userID
          isreserved: true,
        },
        include: [
          {
            association: "room",
            where: {
              officeid: officeID, //officeID
            },
          },
        ],
        order: [["reservationid", "DESC"]],
        limit: 150,
      });

      if (reservationsUser.length < 100) {
        // Gets the reservervations from the same user's level
        try {
          const json_search = {
            level: level,
            officeID: officeID,
          };
          const levelRecommendation_options = {
            method: "POST",
            url:
              process.env.PUBLIC_BACK_BASEURL +
              "/reservations/levelsLastReservations",
            headers: { "Content-Type": "application/json" },
            data: json_search,
          };

          const reservationsLevel = await axios.request(
            levelRecommendation_options
          );

          return res.json(reservationsLevel.data);
        } catch (error) {
          console.log(error);
          return res
            .status(203)
            .json({ message: "Error getting user's level reservations" });
        }
      } else {
        return res.json(reservationsUser);
      }
    } catch (error) {
      console.log(error);
      return res
        .status(203)
        .json({ message: "Error getting user's reservations" });
    }
  },

  async levelsLastReservations(req, res) {
    const { level, officeID } = req.body;

    try {
      const reservations = await Reservations.findAll({
        where: {
          isreserved: true,
        },
        include: [
          {
            association: "room",
            where: {
              officeid: officeID,
            },
          },
          {
            association: "user",
            where: {
              _level: level,
            },
          },
        ],
        order: [["reservationid", "DESC"]],
        limit: 150,
      });

      return res.json(reservations);
    } catch (error) {
      console.log(error);
      return res
        .status(203)
        .json({ message: "Error getting user's level reservations" });
    }
  },
};
