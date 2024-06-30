import { MatrixClient, MentionPill, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import { listRooms } from "../../libs/Rooms"

//Command exemple !listrooms officeid

export async function runListRoomsCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
    var officeId = args[1]

    var res: AxiosResponse

    try {
        const response_rooms = await listRooms(officeId);
        res = response_rooms;

        if (response_rooms.status == 200) {
            var rooms = JSON.stringify(response_rooms.data);
            return client.sendMessage(roomId, {
                body: `!status ${officeId} True ${rooms.replace(' ', '')} `,
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