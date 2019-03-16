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
                <FormItem label="角色名：" prop="RoleName">
                    <Input v-model="formData.RoleName" placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="个人简介：">
                    <Input type="textarea" :rows="4" v-model="formData.RoleMarke" placeholder="请输入个人简介"></Input>
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
    import {ModifyRoleInfo,GetRoleList} from '@/api/roleManageApi.js'
    import {validatePhoneNum, validateBrithday} from '@/libs/Validation.js'

    export default {
        props: {rowId: String, isClose: Boolean,isConfig:Boolean},
        name: "modify-user-info",
        data() {
            return {
                loading: false,
                title:"新增",
                formData: {
                    RoleName:'',
                    RoleMarke:''
                },
                ruleValidate: {
                    RoleName: [{required: true, type: "string", message: "请输入姓名", trigger: 'blur'}],
                }
            }
        },
        methods: {
            getUser() {
                GetRoleList({roleId:this.rowId, pageSize: 10, pageNum: 1}).then(res =>{
                    if(res.data.code==0){
                        this.formData=res.data.data.data[0];
                    }
                })
            },//得到要修改用户的信息
            _close() {
                this.$emit('close')
            },//关闭弹窗
            _saveBtn(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.formData.State="1";
                        ModifyRoleInfo(this.formData).then(res => {
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
                    this.getUser();
                }
            }
        },
        created() {
            this.openModel()
        }
    }
</script>

<style scoped>

</style>
