<template>
    <div class="header ivu-card">
        <Card dis-hover>
            <Row>
                <Col span="6">
                    <div>
                        <label>用户名：</label>
                        <Input v-model="userName" placeholder="用户名" style="width:150px"/>
                    </div>
                </Col>
                <Col span="6">
                    <div>
                        <label>手机号：</label>
                        <Input v-model="mobile" placeholder="手机号" style="width:150px"/>
                    </div>
                </Col>
                <Col span="12">
                    <div style="float: right">
                        <Button type="primary" icon="ios-search">查询</Button>
                        <Button type="success" icon="md-add">新增</Button>
                    </div>

                </Col>

            </Row>


        </Card>
    </div>
</template>

<script>
    export default {
        name: "userManagementHeader",
        data() {
            return {

            }
        },

    }
</script>

<style scoped>
    .ivu-card {
        border-radius: 0px;
    }
</style>
