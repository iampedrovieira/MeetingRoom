import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";

interface LoginResponse {
  success: Boolean;
  token?: String;
}

export interface User {
  name: string;
  username:string
  userid: number;
  defaultOffice: number;
  level: number;
  iat: number;
  exp: number;
}

export async function login(
  username: String,
  password: String
): Promise<LoginResponse> {
  var result: LoginResponse;
  try {
    const options: AxiosRequestConfig = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/user/login",
      headers: { "Content-Type": "application/json" },
      data: { user: username, password: password },
    };

    const response: AxiosResponse = await axios.request(options);

    if ((response.status = 200)) {
      result = {
        success: true,
        token: response.data.token,
      };
    } else {
      result = {
        success: false,
      };
    }
  } catch (error) {
    result = {
      success: false,
    };
  }
  return result;
}

export async function sessionValidation(token: String): Promise<Boolean> {
  try {
    //Token validation
    const options_token: AxiosRequestConfig = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/user/session",
      headers: { "Content-Type": "application/json" },
      data: {
        token: token,
      },
    };

    const response_token = await axios.request(options_token);
    if (response_token.status == 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function changeOfficeSession(token:String,newOffice:any):Promise<AxiosResponse<any>>{
  
  const options:AxiosRequestConfig = {
    method: "POST",
    url: process.env.NEXT_PUBLIC_BACK_BASEURL + "/user/change-office",
    headers: { "Content-Type": "application/json" },
    data: {
      newOffice: newOffice,
      token: token,
    },
  };
  const response_token = await axios.request(options);
    
    return response_token
}
