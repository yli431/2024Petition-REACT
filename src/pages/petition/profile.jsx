import Header from "@/component/home/header.jsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {message} from "antd";
import {exeSql, getLogin, saveLogin} from "@/utils/function.js";
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
import {
    getCategories,
    getPetition,
    getPetitionImgUrl,
    getPetitions,
    getUserImage,
    getUserImgUrl,
    getUserinfo
} from "@/utils/url.js";
import {useParams} from "react-router-dom";
import {stringify} from "qs";

const Profile=()=>{
    const logininfo = useSelector(state => state.user);
    const params=useParams();
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
            <Content params={params} logininfo={logininfo}/>

        </ConfigProvider>
    )
}
export default Profile;

const Content=(props)=>{
    const logininfo = useSelector(state => state.user);
    const navigator=useNavigate();

    const [info,setInfo]=useState(null);
    const [file,setFile]=useState(null);

    const [form] = Form.useForm();
    const [email,setEmail]=useState(1);
    const [emailStatus,setEmailStatus]=useState(null)
    const [emailHelp,setEmailHelp]=useState(null)

    const [firstName,setFirstName]=useState(null);
    const [firstNameStatus,setFirstNameStatus]=useState(null)
    const [firstNameHelp,setFirstNameHelp]=useState(null)

    const [lastName,setLastName]=useState(null);
    const [lastNameStatus,setLastNameStatus]=useState(null)
    const [lastNameHelp,setLastNameHelp]=useState(null)

    const [password,setPassword]=useState(null);
    const [passwordStatus,setPasswordStatus]=useState(null)
    const [passwordHelp,setPasswordHelp]=useState(null)

    useEffect(()=>{
        setEmail(logininfo.email);
        setFirstName(logininfo.firstName);
        setLastName(logininfo.lastName);
        form.setFieldsValue({ email: logininfo.email});
        form.setFieldsValue({ firstName:logininfo.firstName });
        form.setFieldsValue({ lastName:logininfo.lastName });
        form.setFieldsValue({ password:null });
        const sql="select * from user where id="+logininfo.userid;
        exeSql(sql).then(r=>{
            if(r?.length>0){
                setInfo(r[0])
            }
        })
    },[logininfo])

    const dispatch=useDispatch();

    const submit=async ()=>{
        if(!email){
            setEmailStatus("error");
            setEmailHelp("can not be empty")
            return;
        }
        if(!firstName){
            setFirstNameStatus("error");
            setFirstNameHelp("can not be empty")
            return;
        }
        if(!lastName){
            setLastNameStatus("error");
            setLastNameHelp("can not be empty")
            return;
        }
        if(password&&password.length<6){
            setPasswordStatus("error");
            setPasswordHelp("at least 6 characters")
            return;
        }
        const param={
            email:email,
            firstName:firstName,
            lastName:lastName
        }
        if(password){
            param.password=password
        }

       request({
            url:getUserinfo(logininfo.userid),
            method:"patch",
            headers:{
                'X-Authorization':logininfo.token,
                "Content-Type":"application/json"
            },
            data:param
        }).then(r=>{
           const newLogin={
               userid:logininfo.userid,
               email:email,
               token:logininfo.token
           }
           saveLogin(newLogin);
           dispatch(setUser(newLogin));
           console.log(file);
           if(file!==null){
               const fileReader = new FileReader();
               fileReader.readAsArrayBuffer(file);
               fileReader.onload = async () => {
                   const blob = new Blob([fileReader.result]);
                   request({
                       url: getUserImage(logininfo.userid),
                       method: "put",
                       headers: {
                           "X-Authorization": logininfo.token,
                           "Content-Type": "image/jpeg"
                       },
                       data: blob
                   })
               };
           }
           message.success("success",2);
           setTimeout(()=>{
               location.reload();
           },2000)
       }).catch(err=>{
            console.log(err)
           message.error("fail",2);
       })


    }

    return <div className={styles.content}>
        <Link to={"/"}><button>index</button></Link>
        <h2 className={styles.title}>my profile</h2>
        <Form
            form={form}
            name="dependencies"
            autoComplete="off"
            layout="vertical"
        >
        <Form.Item label="email" name="email"  validateStatus={emailStatus} help={emailHelp} rules={[
            {
                required: true,
            },
        ]}>
            <Input   onChange={(evt)=>{setEmail(evt.target.value)}} />
        </Form.Item>
            <Form.Item label="firstName" name="firstName"  validateStatus={firstNameStatus} help={firstNameHelp} rules={[
                {
                    required: true,
                },
            ]}>
                <Input   onChange={(evt)=>{setFirstNameHelp(evt.target.value)}} />
            </Form.Item>
            <Form.Item label="lastName" name="lastName"  validateStatus={lastNameStatus} help={lastNameHelp} rules={[
                {
                    required: true,
                },
            ]}>
                <Input   onChange={(evt)=>{setLastName(evt.target.value)}} />
            </Form.Item>
            <Form.Item label="password" name="password"  validateStatus={passwordStatus} help={passwordHelp}>
                <Input autoComplete="new-password" type="password"   onChange={(evt)=>{setPassword(evt.target.value)}} />
            </Form.Item>
            <Form.Item label="image" name="image"  validateStatus="" help="">
                <img src={getUserImgUrl(logininfo.userid)} style={{display:info?.image_filename?"block":"none",maxWidth:"400px"}}  />
                <br/>
                <UploadProfile setFile={setFile} />
            </Form.Item>


            </Form>
        <button className={styles.submit} onClick={submit}>submit</button>
        <Link to={"/"} className={styles.nav}><button className={styles.back}>back</button></Link>
    </div>
}

const UploadProfile = (props) => {
    const [filename,setFilename]=useState(null);
    const inputRef = useRef();
    const click = () => {
        inputRef.current.click();
    }
    const change = (evt) => {
        setFilename(evt.target.value)
        props.setFile(evt.target.files[0])
    }
    return (
        <>
            <Button icon={<UploadOutlined/>} onClick={click}>Click to Upload</Button>
            {filename}
            <input ref={inputRef} type="file" id="upload" onChange={change} style={{display: "none"}}/>
        </>

    )
}