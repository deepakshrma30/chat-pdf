import axios from "axios"

export const createChat=async({file_key,fileName}:{file_key:string;fileName:string})=>{
    let body={
        file_key,
        fileName
    }
    const data= await axios.post("/api/create-chat",body);
    return data.data
}