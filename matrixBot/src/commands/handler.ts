import { LogService, MatrixClient, MessageEvent, RichReply, UserID } from "matrix-bot-sdk";
import { runReseveCommand } from "./reserve";
import { runListRoomsCommand } from "./listrooms";
import { runListFreeRoomsCommand} from './listfreerooms'
import { runListOfficesCommand} from './listOffices'
import{runDeleteReservationCommand} from './deleteReservation'
import{runLastReservesCommand} from './lastReservations'
import{runReservationsByRoomDate} from './reservationsByRoomDate'
import * as htmlEscape from "escape-html";

// The prefix required to trigger the bot. The bot will also respond
// to being pinged directly.
export const COMMAND_PREFIX = "!";

// This is where all of our commands will be handled
export default class CommandHandler {

    // Just some variables so we can cache the bot's display name and ID
    // for command matching later.
    private displayName: string;
    private userId: string;
    private localpart: string;

    constructor(private client: MatrixClient) {
    }

    public async start() {
        // Populate the variables above (async)
        await this.prepareProfile();

        // Set up the event handler
        this.client.on("room.message", this.onMessage.bind(this));
    }

    private async prepareProfile() {
        this.userId = await this.client.getUserId();
        this.localpart = new UserID(this.userId).localpart;

        try {
            const profile = await this.client.getUserProfile(this.userId);
            if (profile && profile['displayname']) this.displayName = profile['displayname'];
        } catch (e) {
            // Non-fatal error - we'll just log it and move on.
            LogService.warn("CommandHandler", e);
        }
    }

    private async onMessage(roomId: string, ev: any) {
        const event = new MessageEvent(ev);
        if (event.isRedacted) return; // Ignore redacted events that come through
        // TEMPORARY if (event.sender === this.userId) return; // Ignore ourselves
        if (event.messageType !== "m.text") return; // Ignore non-text messages
        if(roomId !== process.env.ROOM_ID) return ; //Ignore other room request.
        // Ensure that the event is a command before going on. We allow people to ping
        // the bot as well as using our COMMAND_PREFIX.
        const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
        const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
        if (!prefixUsed) return; // Not a command (as far as we're concerned)

        // Check to see what the arguments were to the command
        const args = event.textBody.substring(prefixUsed.length).trim().split(' ');
        
        // Try and figure out what command the user ran, defaulting to help
        try {
            const command = args[0]
            switch(command){
                
                case "reserve":{
                    return runReseveCommand(roomId, event, args, this.client);
                }

                case "listrooms" : { 
                    return runListRoomsCommand(roomId, event, args, this.client);
                }
                case "listoffices" : { 
                    return  runListOfficesCommand(roomId, event, args, this.client);
                }
                case "listfreeoffices" : { 
                    return  runListFreeRoomsCommand(roomId, event, args, this.client);
                }
                case "deleteReservation" : { 
                    return  runDeleteReservationCommand(roomId, event, args, this.client);
                }
                case "lastReserves" : { 
                    return runLastReservesCommand(roomId, event, args, this.client);
                }
                case "reservationsByRoomDate" : { 
                    return runReservationsByRoomDate(roomId, event, args, this.client);
                }
                
                case "status" : {

                    return
                }
                default:{
                    const help = "" +
                    "!listrooms [officeid] \n   - return !status [officeid] boolean [response].\n" +
                    "!reserve [userid] [dd-mm-yyyy] (start)[hh:mm] (end)[hh:mm] [roomid] \n  - return !status [botid] [userid] [boolean].\n"+
                    "!listfreeoffices [officeid] [userid] [mm/dd/yy] start[hh:mm] end[hh:mm] \n   - return !status [officeid] [userid] boolean [response].\n"
                    const text = `Help menu:\n${help}`;
                    const html = `<b>Help menu:</b><br /><pre><code>${htmlEscape(help)}</code></pre>`;
                    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
                    reply["msgtype"] = "m.notice"; // Bots should always use notices
                    return this.client.sendMessage(roomId, reply);
                }
            }
        } catch (e) {
            // Log the error
            LogService.error("CommandHandler", e);

            // Tell the user there was a problem
            const message = "There was an error processing your command";
            const reply = RichReply.createFor(roomId, ev, message, message); // We don't need to escape the HTML because we know it is safe
            reply["msgtype"] = "m.notice";
            return this.client.sendMessage(roomId, reply);
        }
    }
}
