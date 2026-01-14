import axios from "axios";

const api = axios.create({
  baseURL: "https://xchat-backend-cu9l.onrender.com",
  withCredentials: true,
});

export default api;
