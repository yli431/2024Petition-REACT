import Header from "@/component/home/header.jsx";
import {ConfigProvider} from "antd";
import Content from "@/component/petition/content.jsx";

const Index=()=>{
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
            <Content/>
        </ConfigProvider>
    )
}
export default Index;