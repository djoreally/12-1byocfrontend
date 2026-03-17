import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/",
});

const token = Cookies.get("token");
const headers = {
  Authorization: `Bearer ${token}`,
};

api.defaults.headers.common = headers;

export default api;
