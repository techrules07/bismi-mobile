import axios from "axios";

const AxiosConfig = axios.create({
    baseURL: 'http://97.74.94.57:8080/bismi-test/',
    headers: {
        "Content-Type": "application/json", 
    }
})

export {AxiosConfig}