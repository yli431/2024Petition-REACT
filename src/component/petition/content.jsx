import timePng from "@/assets/img/time.png";
import { exeSql } from "@/utils/function.js";
import { getPetitionImgUrl, getUserImgUrl } from "@/utils/url.js";
import { Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./petition.module.less";

const Content=()=>{
    const [petition,setPetition]=useState(null);
    const [supportTier,setSupportTier]=useState(null);
    const [supporters,setSupporters]=useState(null);
    const [similar,setSimilar]=useState(null);
    let params=useParams();
    const sql="SELECT A.*,A.id AS pid,B.* FROM petition AS A  JOIN user AS B ON A.owner_id=B.id WHERE A.id="+params.petitionId;
    const sql2="SELECT * FROM support_tier WHERE petition_id="+params.petitionId;
    const sql3="SELECT * FROM supporter AS A JOIN support_tier AS B ON A.support_tier_id=B.id WHERE A.petition_id="+params.petitionId+" order by A.id desc";
    useEffect(()=>{
        exeSql(sql).then(r=>{
            if(r?.length>0){
                setPetition(r[0]);
                const where="where A.id!="+r[0].pid+" and (A.category_id="+r[0].category_id+" || A.owner_id="+r[0].owner_id+")"
                const sql4="SELECT A.*,B.name,C.first_name,C.last_name,D.cost FROM petition AS A JOIN category AS B ON A.category_id=B.id JOIN user AS C ON A.owner_id=C.id JOIN support_tier AS D ON A.id=D.petition_id "+where+"  GROUP BY A.id";
                exeSql(sql4).then(r=>{
                    setSimilar(r);
                })

            }
        });
        exeSql(sql2).then(r=>{
            setSupportTier(r);
        });
        exeSql(sql3).then(r=>{
            setSupporters(r);
        })

    },[params.petitionId])
    // console.log(petition)
    // console.log(supportTier)
    // console.log(supporters)
    let money=0;
    if(supporters?.length>0){
        supporters.map(supporter=>{
            money+=supporter.cost;
        })
    }
    const items1 = [
        {
            key: '1',
            label: 'Available support tiers',
            children: '',
        }
    ];
    const items2 = [
        {
            key: '1',
            label: 'List of supporters',
            children: '',
        }
    ];
    const items3 = [
        {
            key: '1',
            label: 'Similar petitions',
            children: '',
        }
    ];
    return (
        <article className={styles.article}>
            <Back/>
            <h2 className={styles.petitionTitle}>{petition?petition.title:null}</h2>
            <ul className={styles.petOther}>
                <li><img className={styles.timeIcon} src={timePng}/>2023-02-20 09:15:00</li>
                <li>owner:{petition?petition.first_name:null} {petition?petition.last_name:null}</li>
                <li>supporters:{supporters?supporters?.length:null}</li>
                <li>total money raised:${money}</li>
            </ul>
            <img className={styles.petimg} src={petition?getPetitionImgUrl(petition.pid):""}/>

            <Tabs defaultActiveKey="1" size="large" items={items1}/>
            <SupporterTiers supporterTier={supportTier}/>
            <Tabs defaultActiveKey="1" size="large" items={items2}/>
            <Supporters supporters={supporters}/>
            <Tabs defaultActiveKey="1" size="large" items={items3}/>
            <Petitions similar={similar}/>

        </article>
    )
}
export default Content;

export const Back=()=>{
    return <Link to={"/"} className={styles.nav}><button>back</button></Link>
}

const SupporterTiers=(props)=>{
    const dataSource=[];
    if(props.supporterTier?.length>0){
        props.supporterTier.map((tier,index)=>{
            const obj={
                key: index+1,
                title: tier.title,
                description: tier.description,
                cost: tier.cost,
            }
            dataSource.push(obj);
        })
    }


    const columns = [
        {
            title: 'title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'cost',
            dataIndex: 'cost',
            key: 'cost',
        },
    ];
    return (
        <Table pagination={false} dataSource={dataSource} columns={columns} />
        )
}

const Supporters=(props)=>{
    const dataSource=[];
    if(props.supporters?.length>0){
        props.supporters.map((s,index)=>{
            const obj={
                key: index+1,
                supportTier: s.title,
                message: s.message,
                occurredTime: s.timestamp,
                profilePicture:getUserImgUrl(s.user_id)
            }
            dataSource.push(obj);
        })
    }


    const columns = [
        {
            title: 'support tier',
            dataIndex: 'supportTier',
            key: 'supportTier',
        },
        {
            title: 'message',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: 'occurred time',
            dataIndex: 'occurredTime',
            key: 'occurredTime',
        },
        {
            title: 'profile picture',
            dataIndex: 'profilePicture',
            key: 'profilePicture',
            render: (text) => <img src={text} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        }
    ];
    return (
        <Table pagination={false} dataSource={dataSource} columns={columns} />
    )
}

const Petitions=(props)=>{
    console.log(props)
    const dataSource=[];
    if(props.similar?.length>0){
        props.similar.map((s,index)=>{
            const obj={
                key: index+1,
                HeroImage: getPetitionImgUrl(s.id),
                title: s.title,
                creationDate: s.creation_date,
                category:s.name,
                owner:s.first_name+""+s.last_name,
                supportingCost:"$"+s.cost
            }
            dataSource.push(obj);
        })
    }


    const columns = [
        {
            title: 'Hero image',
            dataIndex: 'HeroImage',
            key: 'HeroImage',
            render: (text) => <img src={text} alt="avatar" style={{ width: '50px', height: '50px' }} />
        },
        {
            title: 'title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'creation date',
            dataIndex: 'creationDate',
            key: 'creationDate',
        },
        {
            title: 'category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'owner',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'supporting cost',
            dataIndex: 'supportingCost',
            key: 'supportingCost',
        }
    ];
    return (
        <Table pagination={false} dataSource={dataSource} columns={columns} />
    )
}