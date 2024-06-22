//export const baseUrl="http://localhost:4941/api/v1";
export const baseUrl="https://seng365.csse.canterbury.ac.nz/api/v1/";
export const getPetitions="/petitions";
export const getUserlogin="/users/login";
export const getExecSql="/executeSql";
export const getRegister="/users/register";
export const getCategories="/petitions/categories";
export const getPetitionImgUrl=(id)=>{
    return baseUrl+"/petitions/"+id+"/image";
}
export const getUserImgUrl=(id)=>{
    return baseUrl+"/users/"+id+"/image";
}
export const getUserImage=(id)=>{
    return "/users/"+id+"/image";
}
export const getUserinfo=(id)=>{
    return "/users/"+id;
}
export const getPetitionSupportTiers=(id)=>{
    return "/petitions/"+id+"/supportTiers";
}
export const getPetition=(id)=>{
    return "/petitions/"+id;
}
export const getSupporter=(id)=>{
    return "/petitions/"+id+"/supporters";
}


