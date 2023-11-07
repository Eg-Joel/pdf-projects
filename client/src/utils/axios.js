import axios from "axios";

const baseUrl = "http://localhost:3000/api/" 
const instance =axios.create({
    baseURL:baseUrl,
})

export default instance