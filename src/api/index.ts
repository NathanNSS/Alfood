import axios from "axios";

const api_V1 = axios.create({
    baseURL:"http://localhost:8000/api/v1/"
})

const api_V2 = axios.create({
    baseURL:"http://localhost:8000/api/v2/"
})

export {api_V1, api_V2};