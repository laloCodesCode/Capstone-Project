import { API } from "./api";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;




export const createToken = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);



const response = await axios({
  method: 'post',
  url: `${process.env.EXPO_PUBLIC_BACKEND_URL}/token`,
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  params
});


return response.data;
}


