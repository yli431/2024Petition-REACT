import styles from "./index.module.less";
import Header from "@/component/home/header.jsx";
import {getCategories} from "@/utils/url.js";
import request from "@/utils/request.js";
import {useState,useEffect} from "react";
import List from "@/component/home/list.jsx";
import {ConfigProvider} from "antd";

const Index=()=>{
    const [categories,setCategories]=useState(null);
    const [categoryId,setCategoryId]=useState(false);
    const [cost,setCost]=useState(false);
    const [sort,setSort]=useState(false);
    const [keywords,setKeywords]=useState("");
    const [tmpKey,setTmpKey]=useState("");
    useEffect(()=>{
        request({
            url:getCategories,
            method:"get"
        }).then(r=>{
            setCategories(r)
        })
    },[])
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
            <div>
                <Header/>
                <main>
                    <div className={styles.search}>
                        <div className={styles.item}>
                            <p className={styles.category}>Category</p>
                            <ul className={styles.ul}>
                                <li onClick={()=>setCategoryId(0)} className={categoryId===0?"catactive":"none"}>All</li>
                                {categories?.length>0&&categories.map((category,index)=>{
                                    return <li key={index} onClick={()=>setCategoryId(category.categoryId)} className={categoryId===category.categoryId?"catactive":"none"}>{category.name}</li>
                                })}
                            </ul>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.category}>Cost</p>
                            <ul className={styles.ul}>
                                <li onClick={()=>{setCost(0)}} className={cost===0?"catactive":"none"}>default</li>
                                <li onClick={()=>{setCost(1)}} className={cost===1?"catactive":"none"}>&lt;=$15</li>
                                <li onClick={()=>{setCost(2)}} className={cost===2?"catactive":"none"}>$15&lt;and&lt;=$100</li>
                                <li onClick={()=>{setCost(3)}} className={cost===3?"catactive":"none"}>$100&lt;</li>
                            </ul>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.category}>Sort</p>
                            <ul className={styles.ul}>
                                <li onClick={()=>{setSort(0)}} className={sort===0?"catactive":"none"}>default</li>
                                <li onClick={()=>{setSort(1)}} className={sort===1?"catactive":"none"}>Asc alpha</li>
                                <li onClick={()=>{setSort(2)}} className={sort===2?"catactive":"none"}>Desc alpha</li>
                                <li onClick={()=>{setSort(3)}} className={sort===3?"catactive":"none"}>Asc cost</li>
                                <li onClick={()=>{setSort(4)}} className={sort===4?"catactive":"none"}>Desc cost</li>
                                <li onClick={()=>{setSort(5)}} className={sort===5?"catactive":"none"}>date(first to last)</li>
                                <li onClick={()=>{setSort(6)}} className={sort===6?"catactive":"none"}>date(last to first)</li>
                            </ul>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.category}>Keywords</p>
                            <ul className={styles.ul}>
                                <li><input className={styles.keywords} type="text" value={tmpKey} onChange={(evt)=>setTmpKey(evt.target.value)} placeholder="keywords"/></li>
                                <li><button className={styles.btn} onClick={()=>{setKeywords(tmpKey)}}>search</button></li>
                            </ul>
                        </div>

                    </div>
                    <List categoryId={categoryId} cost={cost} sort={sort} keywords={keywords}/>
                </main>
                <footer>

                </footer>
            </div>
        </ConfigProvider>

    )
}
export default Index;