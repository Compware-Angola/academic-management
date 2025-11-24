import axios from "axios";

export const axiosApexGa = axios.create({
  baseURL: import.meta.env.VITE_APEX_GA_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
