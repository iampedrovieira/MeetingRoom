import { MatrixClient, MentionPill, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import { lastReserves } from "../../libs/Reservations"

//Command exemple !listrooms officeid

export async function runLastReservesCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
    const userid = args[1]
    const office = args[2]

    try {
        const response = await lastReserves(userid,parseInt(office));
        
        if (response) {
            var rooms = JSON.stringify(response);
            return client.sendMessage(roomId, {
                body: `!status lastReserves ${userid} True ${rooms.replace(' ', '')} `,
                msgtype: "m.notice",
                format: "m.text",
            });
        } else {
            var data = JSON.stringify(response);
            return client.sendMessage(roomId, {
                body: `!status lastReserves ${userid} False ${data.replace(' ', '')} `,
                msgtype: "m.notice",
                format: "m.text",
            });
        }
    } catch (error) {
        return client.sendMessage(roomId, {
            body: `!status lastReserves ${userid} False ${error}`,
            msgtype: "m.notice",
            format: "m.text",
        });
    }
}