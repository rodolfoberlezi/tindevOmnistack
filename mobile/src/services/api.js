import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3333"
});

//adb reverse tcp:3333 tcp:3333
//(quando está com o emulador/dispositivo do android, 
//deve utilizar esse comando para o localhost do Android achar o da API)

export default api;