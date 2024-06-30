import { MatrixClient, MentionPill, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import { listOffices } from "../../libs/Offices"

//Command exemple !listrooms officeid

export async function runListOfficesCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
    

    var res: AxiosResponse

    try {
        const response = await listOffices();
        res = response;
        if (response.status == 200) {
            var rooms = JSON.stringify(response.data);
            return client.sendMessage(roomId, {
                body: `!status Offices True ${rooms.replace(' ', '')} `,
                msgtype: "m.notice",
                format: "m.text",
            });
        } else {
            var data = JSON.stringify(response.data);
            return client.sendMessage(roomId, {
                body: `!status Offices False ${data.replace(' ', '')} `,
                msgtype: "m.notice",
                format: "m.text",
            });
        }
    } catch (error) {
        return client.sendMessage(roomId, {
            body: `!status Offices False ${error}`,
            msgtype: "m.notice",
            format: "m.text",
        });
    }
}