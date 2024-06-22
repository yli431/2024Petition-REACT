import Header from "@/component/home/header.jsx";
import {useEffect, useRef,useState} from "react";
import {useSelector} from "react-redux";
import {message} from "antd";
import {exeSql, getLogin} from "@/utils/function.js";
import {setUser} from "@/stores/user.js";
import {useDispatch} from "react-redux";
import {
    ConfigProvider,
    Button,
    Form,
    Input,
    Select,
} from 'antd';
import {UploadOutlined} from "@ant-design/icons";
const { TextArea } = Input;
import styles from "./index.module.less"
import {Link,useNavigate} from "react-router-dom";
import request from "@/utils/request.js";
import {getCategories, getPetitionImgUrl, getPetitions} from "@/utils/url.js";
import List from "@/component/home/list.jsx";

const Mine=()=>{
    const logininfo = useSelector(state => state.user);
    const dispatch=useDispatch();
    if(logininfo.token===null){
        const login=getLogin("login");
        if(login&&JSON.parse(login)){
            const info=JSON.parse(login);
            dispatch(setUser(info));
        }else{
            message.error("login in first");
            return;
        }
    }
    return (
        <ConfigProvider
            theme={{
                token:{
                    colorPrimary:"#386AAC",
                },
                components: {
                    Tabs: {
                        itemSelectedColor:"#386AAC",
                        inkBarColor:"#386AAC",
                    },
                },
            }}
        >
            <Header/>
            <List logininfo={logininfo}/>


        </ConfigProvider>
    )
}
export default Mine;