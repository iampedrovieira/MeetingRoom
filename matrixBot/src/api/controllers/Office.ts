import {client} from '../../index'
import {
    LogService,
    MessageEvent,
} from "matrix-bot-sdk";
import { Request, Response} from 'express';

module.exports = {
    async getOffices(req:Request,res:Response){
        var offices:Array<any> = []
        var rooms_map:Map<string,boolean> = new Map()
        var isAll = false
        const m_room = await client.getJoinedRooms()
        m_room.forEach(room =>{
            if(room != process.env.ROOM_ID){
                rooms_map.set(room,false)
            }
        })
        for(const room of rooms_map.keys()){
            if(room != process.env.ROOM_ID){
                LogService.info("REQUEST","SENDED TO "+room)
                client.sendMessage(room, {
                    body: `!listoffices`,
                    msgtype: "m.text",
                    format: "m.text",
                  });
            }
            
           
        }
        try{

            await client.on("room.message", async function (roomId,ev){
                const event = new MessageEvent(ev);
                
                if (event.isRedacted) return; // Ignore redacted events that come through
                if (event.sender === this.userId) return; // Ignore ourselves
                if (event.messageType !== "m.notice") return; // Ignore non-text messages
                const COMMAND_PREFIX = "!";
                const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
                const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
                if (!prefixUsed) return;
                const args = event.textBody.substring(prefixUsed.length).trim().split(' ');
                if(args[0] == 'status' && args[1]=="Offices" && args[2]=='True'){
                    const list =JSON.parse(args[3])
                    var json_clean ={'domain':roomId.split(':')[1],"offices":list}
                    offices.push(json_clean)
                    rooms_map.set(roomId,true) 
                }
                if(args[0] == 'status' && args[1]=="Offices" && args[2]=='False'){
                    offices.push({"erro":roomId})
                }
                isAll = true
                for(const key of rooms_map.keys()){
                    if(!rooms_map.get(key)){
                        isAll=false
                    }
                }
                if(isAll && !res.headersSent){
                    //build a clean response
                    return res.json(offices)
                }
            });

            await setTimeout(()=>{
                if(!isAll && !res.headersSent){
                    LogService.info("REQUEST","Return by timeout "+offices.length)
                   return res.json(offices)
                }
            },parseInt(process.env.TIMEOUT_DEFAULT))
            
            
        }catch(error){

        }
        
}
  };
  