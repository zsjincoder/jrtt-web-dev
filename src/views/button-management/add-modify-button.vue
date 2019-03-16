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
                <FormItem label="按钮编码" prop="ButtonCode">
                    <Input v-model="formData.ButtonCode" placeholder="请输入按钮编码"></Input>
                </FormItem>
                <FormItem label="按钮名称" prop="ButtonName">
                    <Input v-model="formData.ButtonName" placeholder="请输入按钮名称"></Input>
                </FormItem>
                <FormItem label="按钮路由" >
                    <Input v-model="formData.ButtonPath" placeholder="请输入按钮路由"></Input>
                </FormItem>
                <FormItem   label="所属菜单" >
                    <Select v-model="formData.MenuId">
                        <Option v-for="item in parentList" :value="item.id" :key="item.id">{{ item.menuTitle }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="按钮功能" >
                    <Input type="textarea" :rows="5" v-model="formData.ButtonDescription" placeholder="请输入按钮功能描述"></Input>
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
    import {GetMenuChildList,AddOrModifyButton,QueryButtionList} from '@/api/buttonManageApi.js'
    export default {
        props: {rowId: String, isClose: Boolean,isConfig:Boolean},
        name: "add-modify-menu",
        data() {
            return {
                loading: false,
                title:"新增",
                parentList:[],//父级菜单项数据
                formData: {
                    ButtonCode:'',
                    ButtonPath:'',
                    ButtonName:'',
                    MenuId:'',
                    ButtonDescription:'',
                },
                ruleValidate: {
                    ButtonCode: [{required: true, type: "string", message: "请输入按钮编码", trigger: 'blur'}],
                    ButtonName:[{required: true, type: "string", message: "请输入按钮名称", trigger: 'blur'}],
                }
            }
        },
        created(){
            this.openModel();
            this.getMenuChildData();
        },
        methods: {
            getUser(data) {
                QueryButtionList(data).then(res=>{
                    if(res.data.code==0){
                        this.formData=res.data.data;
                        console.log(this.formData);
                    }
                });
            },//得到要修改用户的信息
            getMenuChildData(){
                GetMenuChildList().then(res=>{
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
                        AddOrModifyButton(this.formData).then(res => {
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
                    this.getUser({buttonId:this.rowId});
                }
            }
        }

    }
</script>

<style scoped>

</style>
