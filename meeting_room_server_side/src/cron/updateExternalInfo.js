const externalOffice = require("../models/ExternalOffices");
const externalRoom = require("../models/ExternalRoomCache");
const axios = require("axios");
const sequelize = require("../database/index")
module.exports = {
  
  async updateExternalInfo() {
    try {

        //Request new offices
        const external_options_office = {
            method: "GET",
            url:
              process.env.MATRIX_BOT_API +
              "/external-office/",
            timeout:1500
          };
        
        const response_external_office = await axios.request(external_options_office);
        //Request new rooms

        //Delete all rows
        //Temporary
        sequelize.query("DELETE FROM externalroommaterials")
        await externalRoom.destroy({where: {}})
        await externalOffice.destroy({where: {}})
        
        console.log('DB clean')
        //Add new external office
        for(const domain_ of response_external_office.data){
            const domain = domain_.domain
            console.log("ADD DOMAIN.... "+domain)
            for(const office of domain_.offices){
              
              externalOffice.create({
                officeid:office.officeid+":"+domain,
                description:office.description,
              })
              //Get rooms
              const external_options_rooms = {
                method: "GET",
                params: {domain: domain, officeid: office.officeid},
                url:
                  process.env.MATRIX_BOT_API +
                  "/external-office/rooms",
                timeout:15000
              };
              
              const response_external_rooms = await axios.request(external_options_rooms);
              for(const room of response_external_rooms.data){
                await externalRoom.create({
                  roomid:room.roomid+":"+domain,
                  _name: room._name,
                  description: room.description,
                  _location: room._location||" ",
                  image:room.image,
                  seats: room.seats,
                  officeid:office.officeid+":"+domain,
                })
                
                //Add materials
                for(const material of room.materials){
                  //Temporary
                  await sequelize.query("INSERT INTO externalroommaterials(materialid,roomid,quantity)" +
                  "values(:materialid,:roomid,:quantity)",
                      {replacements:
                        {
                          materialid:material.materialid,
                          roomid:room.roomid+":"+domain,
                          quantity:1
                        }})
                }
              }
            
            }
            console.log("... DONE")
        }
        
        
    } catch (error) {
        console.log(error)
    }
  },
};