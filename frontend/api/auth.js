import axios from "axios"

const backendUrl = "http://localhost:3000"
// const backendUrl = "http://172.20.10.6:3000"

const api = axios.create({
    baseURL:backendUrl,
    withCredentials:false,
    headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }
})
export const showMovers = () => api.get("/moving/showMovers")
export const signIn = (data) => api.get("/auth/signIn", { params: data });
export const signUp = (data) => api.get("/auth/signUp", {params:data})
export const isTokenValid = (token) => api.get("/auth/isTokenValid", {params:{token:token}})