import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";

export async function listOffices(): Promise<AxiosResponse> {
    var res: AxiosResponse

    const options: AxiosRequestConfig = {
        method: "GET",
        url: process.env.API_BASE_URL + "/offices/list?external=true",
        headers: { "Content-Type": "application/json" },
        params: {external: 'true'}
    };

    try {
        const response_offices = await axios.request(options);
        res = response_offices
        
    } catch (error) {
        console.log(error)
     }

    return res
}