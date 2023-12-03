import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    // baseURL: "https://oyster-app-mekkm.ondigitalocean.app/",
    baseURL: "http://localhost:8000/",
});

const token = Cookies.get("token");
const headers = {
  Authorization: `Bearer ${token}`,
};

api.defaults.headers.common = headers;

export default api;
