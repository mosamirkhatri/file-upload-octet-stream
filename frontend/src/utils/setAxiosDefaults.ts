import axios from "axios";

export function setAxiosDefaults() {
  axios.defaults.baseURL =
    process.env.NODE_ENV === "development"
      ? `http://127.0.0.1:8000/api`
      : `/api`;
  axios.defaults.withCredentials = true;
}
