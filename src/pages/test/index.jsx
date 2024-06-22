import request from "@/utils/request.js";
import {exeSql} from "@/utils/function.js";
import {getRegister} from "@/utils/url.js";
const Index=()=>{

    const error = async () => {
        const param={
            email:"k@gmail1.com",
            password:"1231111",
            firstName:"zhang",
            lastName:"san"
        };
       const r=await request({
           url:getRegister,
           method:"post",
           headers:{
               "Content-Type":"application/json"
           },
           data:param,
       });
        console.log(r);
    };
    return<>
        <input  type="button" onClick={error} value="message"  />
    </>
}
export default Index;