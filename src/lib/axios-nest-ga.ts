import axios from "axios";

export const axiosNestGa = axios.create({
  baseURL: import.meta.env.VITE_NEST_GA_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
