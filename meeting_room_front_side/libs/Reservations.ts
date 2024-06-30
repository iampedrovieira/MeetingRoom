import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import {TimeFormat,DateFormat} from '@/libs/Types'

export async function getReservationsByDay(
  roomid: number,
  date:DateFormat,
  officeId:any,
): Promise<JSON> {
  var result: JSON;
  const options: AxiosRequestConfig = {
    method: "GET",
    url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/reservations/listRoomDate",
    params: {
      roomid: roomid,
      initdate: date,
      officeId:officeId
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

export async function searchReservation(
  userId: number,
  officeIdSelected: number
): Promise<Array<JSON>> {
  var res: Array<JSON>;

  const options: AxiosRequestConfig = {
    method: "POST",
    url:
      process.env.NEXT_PUBLIC_BACK_BASEURL +
      "/reservations/listUsersReservations",
    headers: { "Content-Type": "application/json" },
    data: {
      userID: userId,
      officeid: officeIdSelected,
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

export async function deleteReservations(
  reservationID: number,
  userName:String,
  officeID:any
): Promise<Boolean> {
  var result: Boolean;
  const options: AxiosRequestConfig = {
    method: "GET",
    url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/reservations/cancel",
    params: { reserveid: reservationID,userName:userName,officeid:officeID },
  };
  try {
    const response = await axios.request(options);
    if (response.data.message == "error") {
      result = false;
    } else {
      result = true;
    }
  } catch (error) {
    console.log(error)
    result = false;
  }
  return result;
}

export async function finishReservations(
  reservationID: number
): Promise<Boolean> {
  var result: Boolean;
  const options: AxiosRequestConfig = {
    method: "POST",
    url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/reservations/finish",
    headers: { "Content-Type": "application/json" },
    data: { reserveid: reservationID },
  };
  try {
    const response = await axios.request(options);
    if (response.data.message == "error") {
      result = false;
    } else {
      result = true;
    }
  } catch (error) {
    result = false;
  }
  return result;
}

export async function createReservations(
  format_start_time: TimeFormat,
  format_end_time: TimeFormat,
  format_date: DateFormat,
  roomIdSelected: number,
  userid: Number,
  officeIdSelected: Number,
  level: Number,
  userName:String
): Promise<AxiosResponse> {
  var res:AxiosResponse

  console.log(officeIdSelected);

  const options_reservations: AxiosRequestConfig = {
    method: "POST",
    url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/reservations/create",
    headers: { "Content-Type": "application/json" },
    data: {
      date: format_date,
      startTime: format_start_time,
      endTime: format_end_time,
      roomID: roomIdSelected,
      userID: userid,
      officeID: officeIdSelected,
      level: level,
      userName:userName
    },
  };
  try {

    const response_reservation = await axios.request(options_reservations);
    res = response_reservation
    
  } catch (error) {}

  return res
}
