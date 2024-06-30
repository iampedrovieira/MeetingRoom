import axios, { AxiosRequestConfig } from "axios";
import { TimeFormat, DateFormat } from "@/libs/Types";
export async function getRoomByOffice(officeId:any): Promise<JSON> {
  try {
    var res: JSON;
    var options_rooms: AxiosRequestConfig ;
    if(isNaN(officeId)){
       options_rooms= {
        method: "POST",
        url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/rooms/listByOffice",
        headers: { "Content-Type": "application/json" },
        data: { officeid:officeId.split(':')[0], externalDomain:officeId.split(':')[1] },
      };
    }else{
      options_rooms = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/rooms/listByOffice",
      headers: { "Content-Type": "application/json" },
      data: { officeid: officeId },
    };
    }
    

    const responseRooms = await axios.request(options_rooms);
    if (responseRooms.status == 200) {
      res = responseRooms.data;
    }
  } catch (error) {
    console.log(error);
  }

  return res;
}

export async function getFreeRooms(
  format_date: DateFormat,
  format_start_time: TimeFormat,
  format_end_time: TimeFormat,
  officeIdSelected: Number,
  userid:String
): Promise<Array<FreeRoom>> {
  var res: Array<FreeRoom>;

  const json_search = {
    date: format_date,
    startTime: format_start_time,
    endTime: format_end_time,
    officeid: officeIdSelected,
    userid:userid
  };
  const options_rooms: AxiosRequestConfig = {
    method: "POST",
    url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/rooms/free-rooms",
    headers: { "Content-Type": "application/json" },
    data: json_search,
  };
  try {
    const response_rooms = await axios.request(options_rooms);
    res = response_rooms.data;
  } catch (error) {}
  //Rooms from selectd office

  return res;
}
export interface FreeRoom {
  roomid:Number
}