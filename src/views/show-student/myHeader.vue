<template>
    <header class="menu-header">
        <!-- 资源名称 -->
        <p class="search-name">姓名：</p>
        <div class="serach-up-text">
            <Input type="text" placeholder="请输入姓名" v-model="userName" ></Input>
        </div>
        <div class="search-btn">
            <Button type="primary" @click="search">
                <Icon type="search"></Icon>
                查询
            </Button>
        </div>
        <div class="add-btn" @click="showModal">
            <Button type="success">
                <Icon type="plus-round"></Icon>
                新增
            </Button>
        </div>
    </header>
</template>

<script>
    export default {
        name: "myHeader",
        data(){
            return{
                userName:''
            }
        },
        watch: {
            userName(val){
                this.$emit('getUserRealName',val)
            },
        },
        methods:{
            showModal(){
                this.$emit('showModal');
            },
            search(){
                this.$emit('search', 1);
            }
        }
    }
</script>

<style scoped>

</style>
<style scoped lang="less">
    @import '../../assets/css/index.less';

    .menu-header{
        padding: 20px;
        /* height: 82px; */
        line-height: 30px;
        border: @base-border;
        display: flex;
        .search-name{
            font-weight: @normal-bold-font;
        }
        .search-text,
        .serach-up-text,
        .is-active{
            margin-right: 10px;
            input{
                width: 150px;
                padding-left: 10px;
            }
        }
        .search-btn{
            flex: 1;
            text-align: right;
        }
        .add-btn{
            margin: @add-btn-margin;
        }
    }
</style>
