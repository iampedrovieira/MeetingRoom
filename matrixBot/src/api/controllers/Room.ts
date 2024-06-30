import {client} from '../../index'
import {
    LogService,
    MessageEvent,
} from "matrix-bot-sdk";
import { Request, Response} from 'express';

module.exports = {
    async getRoomsFromOffice(req:Request,res:Response){
        const {domain,officeid} = req.query
        let matrix_roomId:string  
        const m_room = await client.getJoinedRooms()
        m_room.forEach(room =>{
            if(room.split(':')[1] == domain && room != process.env.ROOM_ID){
                matrix_roomId = room
                LogService.info("REQUEST",matrix_roomId)
            }
        })
        client.sendMessage(matrix_roomId, {
            body: `!listrooms `+officeid,
            msgtype: "m.text",
            format: "m.text",
          });
        try{
            await client.on("room.message", async function (roomId,ev){
                const event = new MessageEvent(ev);
                if (event.isRedacted) return; // Ignore redacted events that come through
                if (event.sender === this.userId) return; // Ignore ourselves
                if (event.messageType !== "m.notice") return; // Ignore non-text messages
                if(roomId !== matrix_roomId) return ; //Ignore other chat messages
                if(res.headersSent) return
                
                const COMMAND_PREFIX = "!";
                const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
                const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
                if (!prefixUsed) return;
                const args = event.textBody.substring(prefixUsed.length).trim().split(' ');
                if(args[0] == 'status' && args[1]==officeid && args[2]=='True'){
                
                    return res.json(JSON.parse(args[3]))
                }
                if(args[0] == 'status' && args[1]==officeid && args[2]=='False'){
                    return res.json("Someting wrong")
                }            
            });
        }catch(error){

        }
       
    },
    async getFreeRoomsFromOffice(req:Request,res:Response){
        const {domain,officeid,date,startTime,endTime,userid} = req.body
        let matrix_roomId:string  
        const m_room = await client.getJoinedRooms()
        m_room.forEach(room =>{
            if(room.split(':')[1] == domain && room != process.env.ROOM_ID){
                matrix_roomId = room
            }
        })
        
        client.sendMessage(matrix_roomId, {
            body: `!listfreeoffices `+officeid+" "+userid+" "+date+" "+startTime+" "+endTime,
            msgtype: "m.text",
            format: "m.text",
        });

        try{
            await client.on("room.message", async function (roomId,ev){
                const event = new MessageEvent(ev);
                
                if (event.isRedacted) return; // Ignore redacted events that come through
                if (event.sender === this.userId) return; // Ignore ourselves
                if (event.messageType !== "m.notice") return; // Ignore non-text messages
                if(roomId !== matrix_roomId) return ; //Ignore other chat messages
                if(res.headersSent) return;

                const COMMAND_PREFIX = "!";
                const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
                const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
                if (!prefixUsed) return;
                const args = event.textBody.substring(prefixUsed.length).trim().split(' ');
    
                if(args[0] == 'status' && args[1]==officeid && args[2]==userid && args[3]=='True'){
    
                    return res.json(JSON.parse(args[4]))
                }
                if(args[0] == 'status' && args[1]==officeid && args[2]==userid && args[3]=='False'){
                    return res.json("Someting wrong")
                }            
            });
        }catch(error){

        }
    }
  };
  