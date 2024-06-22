import styles from "./home.module.less";
import {Modal, Input,Dropdown} from 'antd';
import {useState, useRef,useEffect} from "react";
import {useDispatch,useSelector} from "react-redux";
import {UploadOutlined} from '@ant-design/icons';
import {Button,message} from 'antd';
import {getRegister, getUserImage, getUserImgUrl, getUserinfo, getUserlogin} from "@/utils/url.js";
import {clearLogin, exeSql, getLogin, saveLogin} from "@/utils/function.js";
import request from "@/utils/request.js";
import {clearUserinfo, setUser, setUsername} from "@/stores/user.js";
import userPng from "@/assets/img/user.png";
import { ExclamationCircleFilled } from '@ant-design/icons';
import {Link, useNavigate} from "react-router-dom";

const Header = () => {
    const logininfo = useSelector(state => state.user);
    const token = useSelector(state => state.user.token);
    const [info,setInfo]=useState(null);
    useEffect(()=>{
        if(logininfo.token&&logininfo.userid){
            request({
                url:getUserinfo(logininfo.userid),
                method:"get"
            }).then(r=>{
                dispatch(setUsername(r))
            })
            const sql="select * from user where id="+logininfo.userid;
            exeSql(sql).then(r=>{
                if(r?.length>0){
                    setInfo(r[0])
                }
            })
        }else{
            const login=getLogin("login");
            if(login&&JSON.parse(login)){
                const info=JSON.parse(login);
                dispatch(setUser(info));
            }
        }
    },[logininfo,token])



    const [loginModalOpen, setLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState(null);
    const [loginPassword, setLoginPassword] = useState(false);
    const changeLoginEmail = (evt) => {
        setLoginEmail(evt.target.value);
    }
    const changeLoginPassword = (evt) => {
        setLoginPassword(evt.target.value);
    }

    const dispatch=useDispatch();
    const showModal = async () => {
        setLoginModal(true);
    };
    const handleOk = async () => {
        let error=null;
        if(!loginEmail||!loginPassword){
            error="email and password can not be empty";
            message.error(error,1);
            return
        }
        request({
            url:getUserlogin,
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            data:{
                email:loginEmail,
                password:loginPassword
            }
        }).then(login=>{
            if(login?.userId&&login?.token){
                const newLogin={
                    userid:login.userId,
                    email:loginEmail,
                    token:login.token
                }
                saveLogin(newLogin);
                dispatch(setUser(newLogin));
                message.success("login success",2);
                setRegisterModalOpen(false);
                setLoginEmail(null);
                setLoginPassword(null);
            }
            setLoginModal(false);
        }).catch(err=>{
            console.log(err)
            message.error("login fail",2);
        })

    };
    const handleCancel = () => {
        setLoginModal(false);
        clearUserinfo();
    };
    const logout=()=>{
        logoutConfirm()
    }
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const showRegisterModal = () => {
        setRegisterModalOpen(true);
        setEmail(null);
        setPassword(null);
        setFirstName(null);
        setLastName(null);
        setFilename(null);
        setFile(null);
    };
    const handleRegisterOk = async () => {
        let error=null;
        if(!email||!password||!firstName||!lastName){
            error="email,password,firstName,lastName can not be empty";
        }
        if(error===null){
            const reg=/@.*\..+/ig;
            if(reg.test(email)===false){
                error="email format is incorrect";
            }
        }
        if(error===null){
            const sql="select * from user where email='"+email+"'";
            const r=await exeSql(sql);
            if(r?.length>0){
                error="email already in use";
            }
        }
        if(error===null){
            if(password?.length<6){
                error="password must be at least 6 characters";
            }
        }
        if(error!==null){
            message.error(error,1);
            return;
        }
        const param={
            email:email,
            password:password,
            firstName:firstName,
            lastName:lastName
        };
        const r=await request({
            url:getRegister,
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            data:param,
        });
        if(r?.userId){
            const login=await request({
                url:getUserlogin,
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                data:{
                    email:email,
                    password:password
                }
            })
            if(login?.userId&&login?.token){
                const newLogin={
                    userid:login.userId,
                    email:email,
                    token:login.token
                }
                saveLogin(newLogin);
                dispatch(setUser(newLogin));
                if(file!==null){
                    const fileReader = new FileReader();
                    fileReader.readAsArrayBuffer(file);
                    fileReader.onload = async () => {
                        const blob = new Blob([fileReader.result]);
                        request({
                            url: getUserImage(r.userId),
                            method: "put",
                            headers: {
                                "X-Authorization": login.token,
                                "Content-Type": "image/jpeg"
                            },
                            data: blob
                        })
                    };
                }
                message.success("success",2);
                setRegisterModalOpen(false);
                setEmail(null);
                setPassword(null);
                setFirstName(null);
                setLastName(null);
                setFilename(null);
                setFile(null);
            }
            console.log(login);

        }
    };
    const handleRegisterCancel = () => {
        setRegisterModalOpen(false);
        setFilename(null);
    };

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [filename, setFilename] = useState(null);
    const [file,setFile]=useState(null);
    const changeEmail = (evt) => {
        setEmail(evt.target.value);
    }
    const changePassword = (evt) => {
        setPassword(evt.target.value);
    }
    const changeFirstName = (evt) => {
        setFirstName(evt.target.value);
    }
    const changeLastName = (evt) => {
        setLastName(evt.target.value);
    }
    const loginStyle={
        display:logininfo?.token?"none":"block"
    }
    const userStyle={
        display:logininfo?.token?"block":"none"
    }
    const navigator=useNavigate();
    const logoutConfirm = () => {
        const { confirm } = Modal;
        confirm({
            title: 'Do you want to log out?',
            icon: <ExclamationCircleFilled />,
            okText:"yes",
            cancelText:"cancel",
            onOk() {
                navigator("/");
                clearLogin();
                dispatch(clearUserinfo());
            },
            onCancel() {},
        });
    };
    const items = [
        {
            key: '1',
            label: (
                <Link to="/profile">
                    my profile
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link to="/mine">
                    my petitions
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <Link to="/create">
                    create petition
                </Link>
            ),
        },
    ];
    let imgStyle={position:"static"};
    if(info?.image_filename){
        imgStyle={
            width:"40px",
            height: "40px",
            borderRadius: "50%",
        marginTop: "-7px"
        }
    }
    return (
        <header className={styles.header}>
            <h2 className={styles.welcome}>Welcome to Our Petitions Web Portal</h2>
            <div className={styles.login} style={loginStyle}>
                <span onClick={showModal} className={styles.signin}>Sign in</span> / <span onClick={showRegisterModal} className={styles.register}>Register</span>
            </div>
            <div className={styles.user} style={userStyle}>
                <Dropdown
                    menu={{
                        items,
                    }}
                >
                <img style={imgStyle}  src={info?.image_filename?getUserImgUrl(logininfo?.userid):userPng}/>
                </Dropdown>
                <button onClick={logout}>Log out</button>
            </div>
            <Modal okText="Loin" title="Login" open={loginModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>
                    <span>Email</span>
                    <Input placeholder="Email" value={loginEmail} onChange={changeLoginEmail}/>
                </p>
                <p>
                    <span>Password</span>
                    <Input type="password" autoComplete="new-password" value={loginPassword} onChange={changeLoginPassword}/>
                </p>
            </Modal>
            <Modal okText="Register" title="Register" open={registerModalOpen} onOk={handleRegisterOk}
                   onCancel={handleRegisterCancel}>
                <p>
                    <span>Email</span>
                    <Must/>
                    <Input placeholder="Email" onChange={changeEmail}/>
                </p>
                <p>
                    <span>Password</span>
                    <Must/>
                    <Input type="password" onChange={changePassword}/>
                </p>
                <p>
                    <span>First name</span>
                    <Must/>
                    <Input placeholder="first name" onChange={changeFirstName}/>
                </p>
                <p>
                    <span>Last name</span>
                    <Must/>
                    <Input placeholder="last name" onChange={changeLastName}/>
                </p>
                <span>profile picture</span><br/>
                <UploadProfile filename={filename} setFilename={setFilename} setFile={setFile}/>
            </Modal>
        </header>
    )
}
export default Header;

const Must = () => {
    return <span style={{color: "red"}}>*</span>
}

const UploadProfile = (props) => {
    const inputRef = useRef();
    const click = () => {
        inputRef.current.click();
    }
    const change = (evt) => {
        props.setFilename(evt.target.value)
        props.setFile(evt.target.files[0])
    }
    return (
        <>
            <Button icon={<UploadOutlined/>} onClick={click}>Click to Upload</Button>
            {props.filename}
            <input ref={inputRef} type="file" id="upload" onChange={change} style={{display: "none"}}/>
        </>

    )
}

