import timePng from "@/assets/img/time.png";
import { Back } from "@/component/petition/content.jsx";
import { setUser } from "@/stores/user.js";
import { exeSql, getLogin } from "@/utils/function.js";
import request from "@/utils/request.js";
import { getPetition, getPetitionImgUrl, getSupporter } from "@/utils/url.js";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Form, Input, Modal, Pagination, Select, Tabs, message } from 'antd';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./home.module.less";

const List = (props) => {
    const dispatch = useDispatch();
    const logininfo = useSelector(state => state.user);
    const token = useSelector(state => state.user.token);
    useEffect(() => {
        if (!logininfo.token) {
            const login = getLogin("login");
            if (login && JSON.parse(login)) {
                const info = JSON.parse(login);
                dispatch(setUser(info));
            }
        }
    }, [logininfo, token])
    const [myPetitions, setMyPetitions] = useState({});
    const pageSize = 5;
    const [petitions, setPetitions] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    let where;

    if (props.categoryId) {
        where = "A.category_id=" + props.categoryId;
    }
    if (props.cost) {
        if (where === undefined) {
            where = "";
        } else {
            where += " and "
        }
        switch (props.cost) {
            case 1:
                where += "D.cost<=15";
                break;
            case 2:
                where += "D.cost>15 and D.cost<=100";
                break;
            case 3:
                where += "D.cost>100";
                break;
        }
    }
    if (props.keywords) {
        if (where !== "" && where !== undefined) {
            where += " and "
        } else {
            where = " "
        }
        where += "A.title like '%" + props.keywords + "%'";
    }

    if (props.logininfo?.token) {
        where = "A.owner_id=" + props.logininfo.userid;
    }

    let sort = "ORDER BY ";
    switch (props.sort) {
        case 0:
            sort += "A.id asc";
            break;
        case 1:
            sort += "A.title asc";
            break;
        case 2:
            sort += "A.title desc";
            break;
        case 3:
            sort += "D.cost ASC";
            break;
        case 4:
            sort += "D.cost desc";
            break;
        case 5:
            sort += "A.id asc";
            break;
        case 6:
            sort += "A.id desc";
            break;
        default:
            sort += "A.id asc";
    }
    let sql;

    if (where && where !== undefined) {
        sql = "SELECT A.*,B.name,C.first_name,C.last_name,D.cost FROM petition AS A JOIN category AS B ON A.category_id=B.id JOIN user AS C ON A.owner_id=C.id JOIN support_tier AS D ON A.id=D.petition_id where " + where + " GROUP BY A.id " + sort;
    } else {
        sql = "SELECT A.*,B.name,C.first_name,C.last_name,D.cost FROM petition AS A JOIN category AS B ON A.category_id=B.id JOIN user AS C ON A.owner_id=C.id JOIN support_tier AS D ON A.id=D.petition_id  GROUP BY A.id " + sort;
    }
    useEffect(() => {
        if (logininfo?.userid) {
            const sqlm = "select * from petition where owner_id=" + logininfo?.userid;
            exeSql(sqlm).then(r => {
                let pMap = {};
                if (r?.length > 0) {
                    r.map(item => {
                        pMap[item.id] = item
                    })
                }
                setMyPetitions(pMap);

            })
        }

    }, [logininfo?.token]),

        useEffect(() => {
            exeSql(sql).then(r => {
                setPetitions(r);
                setTotal(r?.length);
            })
        }, [props.categoryId, props.cost, props.keywords, props.sort, props.logininfo?.token])
    const items = [
        {
            key: '1',
            label: 'Petitions',
            children: '',
        }
    ];
    const pstyle = {
        display: props.logininfo?.token ? "block" : "none"
    }
    const bstyle = {
        display: props.logininfo?.token ? "block" : "none",
        margin: 0
    }

    const changePage = (page) => {
        setPage(page);
    }
    const delConfirm = (id) => {
        const {confirm} = Modal;
        confirm({
            title: 'Are you sure delete?',
            icon: <ExclamationCircleFilled/>,
            okText: "yes",
            cancelText: "cancel",
            onOk() {
                request({
                    url: getPetition(id),
                    method: "delete",
                    headers: {
                        'X-Authorization': props.logininfo?.token
                    }
                }).then(() => {
                    location.reload();
                })
            },
            onCancel() {
            },
        });
    }
    const [form] = Form.useForm();
    const [tierid, setTierid] = useState(false);
    const [tiers, setTiers] = useState([]);
    const [tiersStatus, setTiersStatus] = useState(null);
    const [tiersHelp, setTiersHelp] = useState(null);

    const [message1, setMessage] = useState(null);
    const [messageStatus, setMessageStatus] = useState(null);
    const [messageHelp, setMessageHelp] = useState(null);

    const [sid, setSid] = useState(null);
    const support = async (id) => {
        const sql = "select * from support_tier where petition_id=" + id + " order by cost asc";
        const r = await exeSql(sql);
        if (r?.length > 0) {
            setTiers(r);
        }
        setSid(id);
        showModal();
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        if (!tierid) {
            setTiersStatus("error");
            setTiersHelp("can not be empty");
            return;
        }
        if (!message) {
            setMessageStatus("error");
            setMessageHelp("can not be empty");
            return;
        }
        const param = {
            supportTierId: tierid,
            message: message1
        }
        request({
            url:getSupporter(sid),
            method:"post",
            headers:{
                'X-Authorization':logininfo?.token,
                "Content-Type":"application/json"
            },
            data:param
        })
        message.success("success",2);
        setTimeout(()=>{
            setIsModalOpen(false);
        },2000)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className={styles.list}>
            <p style={bstyle}>
                <Back/>
            </p>
            <Tabs defaultActiveKey="1" size="large" items={items}/>
            {petitions?.length > 0 && petitions.map((petition, index) => {
                if (index >= (page - 1) * pageSize && index < page * pageSize) {

                    return (
                        <div className={styles.petition} key={index}>
                            <img className={styles.petimg} src={getPetitionImgUrl(petition.id)}/>
                            <div className={styles.petDesc}>
                                <Link to={"/petition/" + petition.id} className={styles.h3}>
                                    {petition.title}
                                </Link>
                                <p style={pstyle} className={styles.pstyle}>
                                    <Link to={"/edit/" + petition.id}>
                                        <button>edit</button>
                                    </Link>
                                    <button onClick={() => {
                                        delConfirm(petition.id)
                                    }}>delete
                                    </button>
                                </p>
                                <p style={{display: logininfo?.token && !myPetitions[petition.id] ? "block" : "none"}}
                                   className={styles.pstyle}>
                                    <button onClick={() => {
                                        support(petition.id)
                                    }}>support
                                    </button>
                                </p>
                                <ul className={styles.petOther}>
                                    <li><img className={styles.timeIcon} src={timePng}/>{petition.creation_date}</li>
                                    <li>category:{petition.name}</li>
                                    <li>owner:{petition.first_name} {petition.last_name}</li>
                                    <li>cost:${petition.cost}</li>
                                </ul>
                            </div>
                        </div>
                    )
                }

            })}
            <Pagination onChange={changePage} pageSize={pageSize} defaultCurrent={page} total={total}/>
            <Modal title="support" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    name="dependencies"
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item label="tiers" name="tiers" validateStatus={tiersStatus} help={tiersHelp} rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <Select onChange={(val) => {
                            setTierid(val);
                        }}>
                            {tiers.map((c, index) => {
                                return <Select.Option key={index + 1} value={c.id}>{c.title}</Select.Option>
                            })}

                        </Select>
                    </Form.Item>
                    <Form.Item label="message" name="message" validateStatus={messageStatus} help={messageHelp} rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <Input onChange={(evt) => {
                            setMessage(evt.target.value)
                        }}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default List;

