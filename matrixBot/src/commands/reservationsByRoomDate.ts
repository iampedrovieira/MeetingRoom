import { MatrixClient, MentionPill, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import { getReservationsByDay } from "../../libs/Reservations"

//Command exemple !listrooms officeid

export async function runReservationsByRoomDate(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
    var roomid = args[1]
    var initdate = args[2]
    try {
        const response_rooms = await getReservationsByDay(parseInt(roomid),initdate);
        var reserves = JSON.stringify(response_rooms);
            return client.sendMessage(roomId, {
                body: `!status reservationsByRoomDate ${roomid} True ${reserves.replace(' ', '')} `,
                msgtype: "m.notice",
                format: "m.text",
            });
        
    } catch (error) {
        return client.sendMessage(roomId, {
            body: `!status ${roomid} False ${error}`,
            msgtype: "m.notice",
            format: "m.text",
        });
    }
}