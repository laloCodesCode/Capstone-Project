import axios from "axios";



// Base URL (suggested set up)


// Base URL var, need to setup some environmental vars
const BASE_URL = http://127.0.0.1:8000





//exception handling 
if (!BASE_URL) {
  throw new Error("BASE_URL not configured properly!")
}




export const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

