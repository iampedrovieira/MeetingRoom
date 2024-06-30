const Rooms = require("../models/Rooms");
const ExternalRooms = require("../models/ExternalRoomCache");
const { Op, Sequelize } = require('sequelize');
const moment = require('moment');
const axios = require("axios");
const { response } = require("express");

module.exports = {
    async listFreeRooms(req, res) {
        try {
            const { date, startTime, endTime, officeid,userid } = req.body;
            
            if(isNaN(officeid)){
                //TO external
                const domain = officeid.split("-")[1]
                const externalOfficeid = officeid.split("-")[0]
                const userM = "@"+userid+":"+domain
                const options_external = {
                method: 'POST',
                url: process.env.MATRIX_BOT_API +'/external-office/free-rooms',
                headers: {'Content-Type': 'application/json'},
                data: {
                    domain: domain,
                    officeid: externalOfficeid,
                    date: date,
                    startTime:startTime,
                    endTime: endTime,
                    userid: userM
                }
                };

                await axios.request(options_external).then(function (response) {
                    
                    return res.json(response.data)
                }).catch(function (error) {
                    console.error(error);
                    return res.json("Someting Wrong")
                });   
            }else{
                const startDate = moment(date + ' ' + startTime, "MM-DD-YYYY HH:mm").format()
                const endDate = moment(date + ' ' + endTime, "MM-DD-YYYY HH:mm").format()
                    /*
                      Para estar livre tem de
                      [] onde as datas inseridas NÃO estão entre  as datas de uma reservar
                       ou
                      [] o isReserved false
                        ex: ini esta dentro e isReseved false ->livre
                            end esta dentro e isReserved false -> livre
                            ambos dentro e isRerserved false -> livre
                            ambos fora e isReserved True -> Livre
                            ambos fora e isReserved false -> livre
                     */
    
                /* 
                      [ THIS IS TEMPORARY UNTIL WE MAKE A BETTER QUERY ] 
                */
    
                //Todos os rooms do office
                const allrooms = await Rooms.findAll({
                    attributes:["roomid"],
                    where: {
                        officeid: officeid
                    },
                })
                //Rooms com reservas no mesmo dia/hora
                const roomsWreservas = await Rooms.findAll({
                    attributes:["roomid"],
                    where: {
                        officeid: officeid
                    },
                    include: [{
                            association: 'reservations',
                            where: {
                                [Op.or]: [{
                                        [Op.all]: Sequelize.literal(`initdate >= '${startDate}' AND initdate < '${endDate}'`)
                                    },
                                    {
                                        [Op.all]: Sequelize.literal(`enddate >  '${startDate}' AND enddate <='${endDate}'`)
                                    }
                                ]
                            }
                        }
    
                    ]
                });
                //Vai as salas com reservas verificar se todos estão false, se tive esta livre
                var freeRooms = allrooms
                if(roomsWreservas.length>0){
    
                }
                roomsWreservas.map(room => {
                    var reserved = false
                    room.reservations.map(reservation => {
                        if (reservation.isreserved)
                            reserved = true;
    
                    })
    
                    if (reserved) {
    
                        //se exisitr no freeRooms tira
                        freeRooms = freeRooms.filter((el) => {
                            return el.roomid != room.roomid
                        })
    
                    } else {
                        //se não existir no freerooms  adiciona
                        var exist_room = false
                        freeRooms.map((roomFree) => {
    
                            if (roomFree.roomid === room.roomid) {
                                exist_room = true
                            }
    
                        })
    
                        if (!exist_room) {
                            freeRooms.push({
                                roomid: room.roomid,
                            })
                        }
    
                    }
                })
    
                /* 
                      [ THIS IS TEMPORARY UNTIL WE MAKE A BETTER QUERY ] 
                */
                return res.json(freeRooms)
            }
            
        } catch (error) {
            console.log(error);
        }
    },

    async listRoomsByOffice(req, res) {
        const { officeid } = req.body;
        try {
            if(isNaN(officeid)==false){
                const officeRooms = await Rooms.findAll({
                    where: {
                        officeid: officeid
                    },
                    include: [{
                        association: 'materials',
                    }, ]
                });
                return res.json(officeRooms);

            }else{
                const extOfficeid =officeid.split('-')[0]
                const extDomain =officeid.split('-')[1]
                const external_options = {
                    method: "GET",
                    params: {domain: extDomain, officeid: extOfficeid},
                    url:
                      process.env.MATRIX_BOT_API +
                      "/external-office/rooms",
                    timeout:process.env.TIMEOUT_DEFAULT
                  };
                
                  const response_external = await axios.request(external_options);
               
                  return res.json(response_external.data)
            }
            
        } catch (error) {
           
            if (!error.response){
                
                //Get external rooms from cache
              
                const roomsExternal = await ExternalRooms.findAll({
                    where: {
                        officeid: officeid.split('-')[0]+":"+officeid.split('-')[1]
                    },
                    include: [{
                        association: 'materials',
                    }, ]
                });
           
                return res.json(roomsExternal);
              }else{
                console.log(error);
              res.status(500).json({ message: "Query error" });
              }
            //TO-DO
            
        }
        
    },

    async listRooms(req, res) {
        try {
            const rooms = await Rooms.findAll({

                include: [{
                    association: 'materials',
                }, ]
            });
            return res.json(rooms);
        } catch (error) {
            console.log(error);
        }
    },
};