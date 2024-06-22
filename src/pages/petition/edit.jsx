import Header from "@/component/home/header.jsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
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
import {getCategories, getPetition, getPetitionImgUrl, getPetitions} from "@/utils/url.js";
import {useParams} from "react-router-dom";

const Edit=()=>{
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
export default Edit;

const Content=(props)=>{
    const [categories,setCategories]=useState([]);

    const navigator=useNavigate();

    const [form] = Form.useForm();
    const [title,setTitle]=useState(1);
    const [titleStatus,setTitleStatus]=useState(null)
    const [titleHelp,setTitleHelp]=useState(null)

    const [description,setDescription]=useState(null);
    const [descriptionStatus,setDescriptionStatus]=useState(null)
    const [descriptionHelp,setDescriptionHelp]=useState(null)

    const [category,setCategory]=useState(null);
    const [categoryStatus,setCategoryStatus]=useState(null)
    const [categoryHelp,setCategoryHelp]=useState(null)

    useLayoutEffect(()=>{
        request({
            url:getCategories,
            method:"get"
        }).then(r=>{
            if(r?.length>0){
                setCategories(r);
            }
        })
        if(props?.params?.id){
            request({
                url:getPetition(props?.params?.id),
                method:"get"
            }).then(r=>{
                console.log(r);
                setTitle(r?.title);
                setDescription(r?.description);
                setCategory(r?.categoryId);
                form.setFieldsValue({ title: r?.title });
                form.setFieldsValue({ description: r?.description });
                form.setFieldsValue({ category: r?.categoryId });
            })
        }
    },[props.params?.id])
    // const [tierStatus,setTierStatus]=useState(null)
    // const [tierHelp,setTierHelp]=useState(null)
    // const [tier1Title,setTier1Title]=useState(null);
    // const [tier1Descrition,setTier1Descrition]=useState(null);
    // const [tier1Cost,setTier1Cost]=useState(null);
    //
    // const [tier2Title,setTier2Title]=useState(null);
    // const [tier2Descrition,setTier2Descrition]=useState(null);
    // const [tier2Cost,setTier2Cost]=useState(null);
    //
    // const [tier3Title,setTier3Title]=useState(null);
    // const [tier3Descrition,setTier3Descrition]=useState(null);
    // const [tier3Cost,setTier3Cost]=useState(null);


    const submit=async ()=>{
        if(!title){
            setTitleStatus("error");
            setTitleHelp("can not be empty")
            return;
        }
        if(!description){
            setDescriptionStatus("error");
            setDescriptionHelp("can not be empty")
            return;
        }
        if(!category){
            setCategoryStatus("error");
            setCategoryHelp("can not be empty")
            return;
        }

        const sql="select * from petition where title='"+title+"' and id!="+props.params?.id;
        const r=await exeSql(sql);
        if(r?.length>0){
            setTitleStatus("error");
            setTitleHelp("already in use")
            return;
        }

        const param={
            title:title,
            description:description,
            categoryId:category,
            petitionId:props.params?.id
        };

        const petition=await request({
            url:getPetition(props.params?.id),
            method:"patch",
            headers:{
                "Content-Type":"application/json",
                'X-Authorization':props.logininfo.token
            },
            data:param
        })
            message.success("success",2);
            setTimeout(()=>{
                navigator("/petition/"+props.params?.id);
            },2000)



    }

    return <div className={styles.content}>
        <Link to={"/mine"}><button>back</button></Link>
        <h2 className={styles.title}>edit petition</h2>
        <Form
            form={form}
            name="dependencies"
            autoComplete="off"
            layout="vertical"
        >
        <Form.Item label="title" name="title"  validateStatus={titleStatus} help={titleHelp} rules={[
            {
                required: true,
            },
        ]}>
            <Input   onChange={(evt)=>{setTitle(evt.target.value)}} />
        </Form.Item>
        <Form.Item label="description" name="description" validateStatus={descriptionStatus} help={descriptionHelp} rules={[
            {
                required: true,
            },
        ]}>
            <TextArea onChange={(evt)=>{setDescription(evt.target.value)}} />
        </Form.Item>
        <Form.Item label="category" name="category" validateStatus={categoryStatus} help={categoryHelp} rules={[
            {
                required: true,
            },
        ]}>
            <Select onChange={(val)=>{setCategory(val);}} >
                {categories.map((c,index)=>{
                    return <Select.Option key={index+1} value={c.categoryId}>{c.name}</Select.Option>
                })}

            </Select>
        </Form.Item>
            </Form>
        <button className={styles.submit} onClick={submit}>submit</button>
        <Link to={"/"} className={styles.nav}><button className={styles.back}>back</button></Link>
    </div>
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