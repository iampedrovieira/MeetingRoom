import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";

export async function listRooms(officeId: string,): Promise<AxiosResponse> {
    var res: AxiosResponse

    const options_rooms: AxiosRequestConfig = {
        method: "POST",
        url: process.env.API_BASE_URL + "/rooms/listByOffice",
        headers: { "Content-Type": "application/json" },
        data: { officeid: officeId },
    };

    try {
        const response_rooms = await axios.request(options_rooms);
        res = response_rooms

    } catch (error) { }

    return res
}
export async function getFreeRooms(
    format_date: String,
    format_start_time: String,
    format_end_time: String,
    officeIdSelected: Number
  ): Promise<AxiosResponse> {
    var res: AxiosResponse;
  
    const json_search = {
      date: format_date,
      startTime: format_start_time,
      endTime: format_end_time,
      officeid: officeIdSelected,
    };
    const options_rooms: AxiosRequestConfig = {
      method: "POST",
      url: process.env.API_BASE_URL + "/rooms/free-rooms",
      headers: { "Content-Type": "application/json" },
      data: json_search,
    };
    try {
      const response_rooms = await axios.request(options_rooms);
      res = response_rooms;
    } catch (error) {}
    //Rooms from selectd office
  
    return res;
  }