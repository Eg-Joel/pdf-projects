import axios from "axios";

const baseUrl = "https://pdf-project.onrender.com/api/" 
const instance =axios.create({
    baseURL:baseUrl,
})

export default instance