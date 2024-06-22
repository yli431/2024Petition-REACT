import {getExecSql, getPetition} from "@/utils/url.js";
import request from "@/utils/request.js";

export const  exeSql=sql=>{
    return request({
        url: getExecSql,
        method: "post",
        headers:{
            "Content-Type":"text/plain"
        },
        data: sql
    });
}

export const saveLogin=(login)=>{
    if(login?.userid&&login?.email&&login?.token){
        localStorage.setItem("login",JSON.stringify(login));
        return true;
    }else{
       return false;
    }
}
export const getLogin=()=>{
    return localStorage.getItem("login");
}
export const clearLogin=()=>{
    localStorage.removeItem("login");
}
