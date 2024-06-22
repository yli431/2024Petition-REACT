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
import {Back} from "@/component/petition/content";

const Create=()=>{
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
            <Content logininfo={logininfo}/>

        </ConfigProvider>
    )
}
export default Create;

const Content=(props)=>{
    const [categories,setCategories]=useState([]);
    const [filename, setFilename] = useState(null);
    const [file,setFile]=useState(null);
    const navigator=useNavigate();
    useEffect(()=>{
        request({
            url:getCategories,
            method:"get"
        }).then(r=>{
            if(r?.length>0){
                setCategories(r);
            }
        })
    },[])
    const [form] = Form.useForm();
    const [title,setTitle]=useState(null);
    const [titleStatus,setTitleStatus]=useState(null)
    const [titleHelp,setTitleHelp]=useState(null)

    const [description,setDescription]=useState(null);
    const [descriptionStatus,setDescriptionStatus]=useState(null)
    const [descriptionHelp,setDescriptionHelp]=useState(null)

    const [category,setCategory]=useState(null);
    const [categoryStatus,setCategoryStatus]=useState(null)
    const [categoryHelp,setCategoryHelp]=useState(null)

    const [tierStatus,setTierStatus]=useState(null)
    const [tierHelp,setTierHelp]=useState(null)
    const [tier1Title,setTier1Title]=useState(null);
    const [tier1Descrition,setTier1Descrition]=useState(null);
    const [tier1Cost,setTier1Cost]=useState(null);

    const [tier2Title,setTier2Title]=useState(null);
    const [tier2Descrition,setTier2Descrition]=useState(null);
    const [tier2Cost,setTier2Cost]=useState(null);

    const [tier3Title,setTier3Title]=useState(null);
    const [tier3Descrition,setTier3Descrition]=useState(null);
    const [tier3Cost,setTier3Cost]=useState(null);



    const [image,setImage]=useState(null);

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
        if(!tier1Title||!tier1Descrition){
            setTierStatus("error");
            setTierHelp("can not be empty")
            return;
        }
        const sql="select * from petition where title='"+title+"'";
        const r=await exeSql(sql);
        if(r?.length>0){
            setTitleStatus("error");
            setTitleHelp("already in use")
            return;
        }
        const supportTiers=[];
        if(tier1Title&&tier1Descrition){
            const tier1={
                title:tier1Title,
                description:tier1Descrition,
                cost:Number(tier1Cost)
            }
            supportTiers.push(tier1);
        }
        if(tier2Title&&tier2Descrition){
            const tier2={
                title:tier2Title,
                description:tier2Descrition,
                cost:Number(tier2Cost)
            }
            supportTiers.push(tier2);
        }
        if(tier3Title&&tier3Descrition){
            const tier3={
                title:tier3Title,
                description:tier3Descrition,
                cost:Number(tier3Cost)
            }
            supportTiers.push(tier3);
        }
        const param={
            title:title,
            description:description,
            categoryId:category,
            authId:props.logininfo.userid,
            supportTiers:supportTiers
        };

        const petition=await request({
            url:getPetitions,
            method:"post",
            headers:{
                "Content-Type":"application/json",
                'X-Authorization':props.logininfo.token
            },
            data:param
        })
        if(petition?.petitionId){
            if(file!==null){
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = async () => {
                    const blob = new Blob([fileReader.result]);
                    request({
                        url: getPetitionImgUrl(petition?.petitionId),
                        method: "put",
                        headers: {
                            "X-Authorization": props.logininfo.token,
                            "Content-Type": "image/jpeg"
                        },
                        data: blob
                    }).then(r=>{
                        console.log(r);
                    });

                };
            }
            message.success("create success",2);
            setTimeout(()=>{
                navigator("/")
            },2000)

        }



    }

    return <div className={styles.content}>
        <Back/>
        <h2 className={styles.title}>create petition</h2>
        <Form
            form={form}
            name="dependencies"
            autoComplete="off"
            layout="vertical"
        >
        <Form.Item label="title" name="title" validateStatus={titleStatus} help={titleHelp} rules={[
            {
                required: true,
            },
        ]}>
            <Input onChange={(evt)=>{setTitle(evt.target.value)}} />
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
        <Form.Item label="supportTiers1" name="supportTiers1" validateStatus={tierStatus} help={tierHelp} rules={[
            {
                required: true,
            },
        ]}>
            title <Input onChange={(evt)=>{setTier1Title(evt.target.value)}}/>
            descrition <Input onChange={(evt)=>{setTier1Descrition(evt.target.value)}}/>
            cost <Input type="number" onChange={(evt)=>{setTier1Cost(evt.target.value)}} min={0}/>
        </Form.Item>
            <Form.Item label="supportTiers2" validateStatus="" help="" name="supportTiers2">
                title <Input onChange={(evt)=>{setTier2Title(evt.target.value)}}/>
                descrition <Input onChange={(evt)=>{setTier2Descrition(evt.target.value)}}/>
                cost <Input onChange={(evt)=>{setTier2Cost(evt.target.value)}} min={0}/>
            </Form.Item>
            <Form.Item label="supportTiers3" validateStatus="" help="" name="supportTiers3">
                title <Input onChange={(evt)=>{setTier3Title(evt.target.value)}}/>
                descrition <Input onChange={(evt)=>{setTier3Descrition(evt.target.value)}}/>
                cost <Input onChange={(evt)=>{setTier3Cost(evt.target.value)}} min={0}/>
            </Form.Item>
        <Form.Item label="Image" name="Image" validateStatus="" help="" rules={[
            {
                required: true,
            },
        ]}>
           <UploadProfile setFile={setFile} filename={filename} setFilename={setFilename}/>
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