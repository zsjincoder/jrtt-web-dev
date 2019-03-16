<template>
    <div>
        <Modal
            v-model="isClose"
            :closable="false"
            :mask-closable="false"
            width="600">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon style="margin-right: 5px"></Icon>
                <span>{{title}}</span>
            </p>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
                <FormItem label="菜单编码" prop="MenuCode">
                    <Input v-model="formData.MenuCode" placeholder="请输入菜单编码"></Input>
                </FormItem>
                <FormItem label="菜单名称" prop="MenuTitle">
                    <Input v-model="formData.MenuTitle" placeholder="请输入菜单名称"></Input>
                </FormItem>
                <FormItem label="菜单图标">
                    <Input v-model="formData.MenuIcon" placeholder="请输入菜单图标"></Input>
                </FormItem>
                <FormItem label="菜单序号" prop="Order">
                    <InputNumber v-model="formData.Order" placeholder="请输入菜单序号"></InputNumber>
                </FormItem>
                <FormItem   label="父级菜单" >
                    <Select v-model="formData.ParentId">
                        <Option v-for="item in parentList" :value="item.id" :key="item.id">{{ item.menuTitle }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="菜单路由">
                    <Input v-model="formData.RoutePath" placeholder="请输入菜单序号"></Input>
                </FormItem>
            </Form>
            <!-- 自定义modal的底部 -->
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close()">关闭</Button>
                <Button type="primary" @click="_saveBtn('formData')" :loading="loading">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {addOrModifyMenu,getParentList,GetMenuList} from '@/api/menuManageApi.js'
    export default {
        props: {rowId: String, isClose: Boolean,isConfig:Boolean},
        name: "add-modify-menu",
        data() {
            return {
                loading: false,
                title:"新增",
                parentList:[{
                    id:'/',
                    menuTitle:'父级菜单'
                }],//父级菜单项数据
                formData: {
                    MenuCode:'',
                    MenuIcon:'',
                    MenuTitle:'',
                    Order:1,
                    ParentId:'',
                    RoutePath:'',
                    Id:''
                },
                ruleValidate: {
                    MenuCode: [{required: true, type: "string", message: "请输入菜单编码", trigger: 'blur'}],
                    MenuTitle:[{required: true, type: "string", message: "请输入菜单名称", trigger: 'blur'}],
                    Order:[{required: true, type: "number", message: "请输入菜单序号", trigger: 'blur'}],
                }
            }
        },
        created(){
            this.openModel();
            this.getPrentData();
        },
        methods: {
            getUser(data) {
                GetMenuList(data).then(res=>{
                    if(res.data.code==0){
                        this.formData=res.data.data[0]
                    }
                });
            },//得到要修改用户的信息
            getPrentData(){
                getParentList().then(res=>{
                    if(res.data.code==0){
                        for (let i=0;i<res.data.data.length;i++){
                            this.parentList.push(res.data.data[i]);
                        }

                    }
                });
            },
            _close() {
                this.$emit('close')
            },//关闭弹窗
            _saveBtn(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.formData.Order= parseInt(this.formData.Order);
                        addOrModifyMenu(this.formData).then(res => {
                            this.loading = false;
                            if (res.data.code == 0) {
                                this.$Message.success("保存成功");
                                this.$emit('closeUpdate');//
                            } else {
                                this.$Message.error("保存失败");
                            }
                        })
                    }
                });

            },//保存后关闭弹窗并更新数据
            openModel(){
                if(this.isConfig){
                    this.title="修改";
                    this.getUser({menuId:this.rowId});
                }
            }
        }

    }
</script>

<style scoped>

</style>
