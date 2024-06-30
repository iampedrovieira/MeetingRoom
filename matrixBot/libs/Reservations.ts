import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";

export async function createReservation(
    date: String,
    startTime: String,
    endTime: String,
    room: String,
    externalID:String
  ): Promise<AxiosResponse> {
    var res:AxiosResponse
  
    const options_reservations: AxiosRequestConfig = {
      method: "POST",
      url: process.env.API_BASE_URL + "/reservations/create",
      headers: { "Content-Type": "application/json" },
      data: {
        date: date,
        startTime: startTime,
        endTime: endTime,
        roomID: room,
        externalID:externalID,
        userID: process.env.BOT_ID ,
      },
    };
    try {
  
      const response_reservation = await axios.request(options_reservations);
      res = response_reservation
      
    } catch (error) {}
  
    return res
  }

  export async function deleteReservation(
    reservationID:number
  ): Promise<AxiosResponse> {
    var res:AxiosResponse
  
    const options_reservations: AxiosRequestConfig = {
      method: "GET",
      url: process.env.API_BASE_URL + "/reservations/cancel",
      headers: { "Content-Type": "application/json" },
      params: { reserveid: reservationID},
    };
    try {
  
      const response_reservation = await axios.request(options_reservations);
      res = response_reservation
      
    } catch (error) {}
  
    return res
  }

  export async function lastReserves(
    userId: String,
    officeIdSelected: number
  ): Promise<Array<JSON>> {
    var res: Array<JSON>;
  
    const options: AxiosRequestConfig = {
      method: "POST",
      url:
        process.env.API_BASE_URL +
        "/reservations/listUsersReservations",
      headers: { "Content-Type": "application/json" },
      data: {
        userID: userId,
        officeid: officeIdSelected,
        fromExternal:true
      },
    };
    try {
      const response = await axios.request(options);
      res = response.data;
    } catch (error) {
      console.error(error);
    }
    return res;
  }

  export async function getReservationsByDay(
    roomid: number,
    date:String,
  ): Promise<JSON> {
    var result: JSON;
    const options: AxiosRequestConfig = {
      method: "GET",
      url: process.env.API_BASE_URL + "/reservations/listRoomDate",
      params: {
        roomid: roomid,
        initdate: date,
      },
    };
    try {
      const response = await axios.request(options);
      if (response.status == 200) {
        result = response.data;
      }
    } catch (error) {}
    return result;
  }