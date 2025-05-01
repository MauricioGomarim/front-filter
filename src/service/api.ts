import axios from "axios"

export const api = axios.create({
  // baseURL: "http://localhost:3333",
  baseURL: "https://backend-filtro-an7.koyeb.app",
  withCredentials: true
})