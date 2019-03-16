<template>
<div>
    <div class="header ivu-card">
        <Card dis-hover>
            <Row>
                <Col span="6">
                    <div>
                        <label>用户名：</label>
                        <Input v-model="queryData.userName" placeholder="用户名" style="width:150px"/>
                    </div>
                </Col>
                <Col span="6">
                    <div>
                        <label>手机号：</label>
                        <Input v-model="queryData.mobile" placeholder="手机号" style="width:150px"/>
                    </div>
                </Col>
                <Col span="12">
                    <div style="float: right">
                        <Button type="primary" icon="ios-search" @click="Query" >查询</Button>
                    </div>

                </Col>

            </Row>


        </Card>
    </div>
    <div style="background-color:#fff">
        <Tabs type="card" @on-click="getFlag">
            <TabPane label="管理员" value="admin" >
                <user-table v-if="Flag=='0'" :Flag="Flag" :querydata="queryData" :ifquery="ifQuery" @ifQuery="setIfQuery"></user-table>
            </TabPane>
            <TabPane label="普通用户" value="user" >
                <user-table v-if="Flag=='1'" :Flag="Flag" :querydata="queryData" :ifquery="ifQuery" @ifQuery="setIfQuery"></user-table>
            </TabPane>
        </Tabs>
    </div>
</div>
</template>

<script>
    import userTable from '@/views/user-Management/userTable.vue'
    export default {
        name: "userManagement",
        components:{userTable},
        data(){
            return{
                queryData:{
                    userName:"",
                    mobile:""
                },
                Flag:"0",
                ifQuery:false
            }
        },
        methods:{
            getFlag(flag){
                this.Flag=flag;
            },
            Query(){
                this.ifQuery=true//点击查询向userTable子组件传状态值
            },
            setIfQuery(){
                this.ifQuery=false//查询完毕userTable子组件触发父组件setIfQuery()函数恢复状态值
            }

        }

    }
</script>

<style scoped>
    .ivu-card {
        border-radius: 0px;
    }
</style>
