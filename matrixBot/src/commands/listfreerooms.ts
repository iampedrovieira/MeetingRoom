import { MatrixClient, MentionPill, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import { getFreeRooms } from "../../libs/Rooms"

//Command exemple !listrooms officeid

export async function runListFreeRoomsCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
    const officeId = parseInt(args[1])
    const sender = args[2]
    const date = args[3]
    const startTime = args[4]
    const endTime = args[5]
    
    var res: AxiosResponse

    try {
        const response_rooms = await getFreeRooms(date, startTime, endTime,officeId);
        res = response_rooms;
        console.log(res)
        if (response_rooms.status == 200) {
            var rooms = JSON.stringify(response_rooms.data);
            return client.sendMessage(roomId, {
                body: `!status ${officeId} ${sender} True ${rooms.replace(' ', '')} `,
                msgtype: "m.notice",
                format: "m.text",
            });
        } else {
            var data = JSON.stringify(response_rooms.data);
            return client.sendMessage(roomId, {
                body: `!status ${officeId} False ${data.replace(' ', '')} `,
                msgtype: "m.notice",
                format: "m.text",
            });
        }
    } catch (error) {
        return client.sendMessage(roomId, {
            body: `!status ${officeId} False ${error}`,
            msgtype: "m.notice",
            format: "m.text",
        });
    }
}