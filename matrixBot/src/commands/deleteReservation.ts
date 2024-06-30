import { LogLevel, LogService, MatrixClient, MentionPill, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import { deleteReservation } from "../../libs/Reservations"

export async function runDeleteReservationCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {

  const user = args[1];
  const reservationID = args[2]

  try {
      const response_reservation = await deleteReservation(parseInt(reservationID));
  
    if (response_reservation.data.message != "error") {
      return client.sendMessage(roomId, {
        body: `!status deleteReservation ${user} True`,
        msgtype: "m.notice",
        format: "m.text",
      });
    } else {
      return client.sendMessage(roomId, {
        body: `!status deleteReservation ${user} False ${response_reservation.data.message} `,
        msgtype: "m.notice",
        format: "m.text",
      });
    }

  } catch (error) {
    return client.sendMessage(roomId, {
      body: `!status deleteReservation ${user} False ${error}`,
      msgtype: "m.notice",
      format: "m.text",
    });
  }
}