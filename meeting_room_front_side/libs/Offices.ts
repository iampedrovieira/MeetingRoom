import axios, { AxiosRequestConfig } from "axios";


export interface Office {
  officeid: number;
  description: string;
}

export async function getAllOffices():Promise<Array<Office>> {
     //getAllOffices
     var res:Array<Office>
     const options_offices:AxiosRequestConfig = {
        method: "GET",
        url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/offices/list",
        headers: { "Content-Type": "application/json" },
      };
      const response = await axios.request(options_offices);
      if(response.status==200){
          res=response.data
      }
      return res
    
}