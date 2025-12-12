import axios from "axios";

export const axiosNestFinance = axios.create({
  baseURL: import.meta.env.VITE_NEST_FINANCE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
