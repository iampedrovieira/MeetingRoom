import { LogLevel, LogService, MatrixClient, MentionPill, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import { createReservation } from "../../libs/Reservations"

export async function runReseveCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {

  const user = args[1];
  const date = args[2];
  const startTime = args[3];
  const endTime = args[4];
  const room = args[5];

  try {
      const response_reservation = await createReservation(date, startTime, endTime, room,user);
  
    if (response_reservation.status == 201) {
      return client.sendMessage(roomId, {
        body: `!status ${user} True ${response_reservation.data.reservationid} `,
        msgtype: "m.notice",
        format: "m.text",
      });
    } else {
      return client.sendMessage(roomId, {
        body: `!status ${user} False ${response_reservation.data.message} `,
        msgtype: "m.notice",
        format: "m.text",
      });
    }

  } catch (error) {
    return client.sendMessage(roomId, {
      body: `!status ${user} False ${error}`,
      msgtype: "m.notice",
      format: "m.text",
    });
  }
}