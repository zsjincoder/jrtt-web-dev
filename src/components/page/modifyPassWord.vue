<template>
    <Modal
        v-model="modFlag1"
        :closable="false"
        :mask-closable="false"
        width="400"
        class-name="vertical-center-modal">
        <!-- 自定义modal的头部 -->
        <p slot="header" style="color:#2d8cf0;">
            <Icon type="plus-round" style="margin-right: 5px"></Icon>
            <span>修改密码</span>
        </p>
        <Form ref="formData"  :model="formData" :rules="ruleValidate" :label-width="80">
            <FormItem label="新密码" prop="Password">
                <Input :type="type" v-model="formData.Password"  placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="ConfirmPassWord">
                <Input :type="type"  v-model="formData.ConfirmPassWord"  placeholder="请确认密码"></Input>
            </FormItem>
            <Checkbox v-model="single" style="margin-left:80px">显示密码</Checkbox>
        </Form>
        <!-- 自定义modal的底部 -->
        <div slot="footer">
            <Button style="margin-left: 8px" @click="_close()">关闭</Button>
            <Button type="primary" @click="_saveBtn('formData')">保存</Button>
        </div>
    </Modal>
</template>

<script>
    //再次验证密码
    import {validatePassWord} from '@/libs/Validation.js'
    import {ModifyPassWord} from '@/api/user.js'
    export default {
       props:{modFlag1:Boolean},
        name: "modifyPassWord",
        data(){
            return{
                single:false,
                type:'password',
                formData:{
                    Id:"",
                    Password:"",
                    ConfirmPassWord:""
                },
                ruleValidate:{
                    Password:[{required:true,type:'string',validator:validatePassWord,trigger:'blur'}],
                    ConfirmPassWord:[{required:true,type:'string',validator:this.validatePassWordAgain}]
                }
            }
        },
        watch:{
            single(value,oldValue){
                if(value==true){
                    this.type="text"
                }else {
                    this.type='password'
                }
            }
        },
        methods:{
            validatePassWordAgain (rule, value, callback){
                if (value === '' || value === undefined) {
                    callback(new Error('请输入密码'));
                } else if (value != this.formData.Password) {
                    callback(new Error('密码不一致，请重新确认'));
                } else {
                    callback();
                }
            },
            _close(){
                this.formData={
                    Id:"",
                    Password:"",
                    ConfirmPassWord:""
                };
                this.single = false;
                this.$emit('cancel1');
            },
            //保存要修改的密码
            _saveBtn(name){
                this.$refs[name].validate(valid =>{
                    if(valid){
                        let newFormData={};
                        let data=JSON.parse(sessionStorage.getItem('userInfo'));
                        newFormData.Id=data.Id;
                        newFormData.Password=this.formData.Password;
                        ModifyPassWord(newFormData).then(res =>{
                            if(res.data.code==0){
                                this.$Message.success("密码修改成功！");
                                this.$confirm('请单击确定按钮重新登陆', {
                                    type: 'success',
                                    callback: (ac, ins) => {
                                        if(ac == 'confirm') {
                                            sessionStorage.clear();
                                            this.$router.push('/login');
                                        }
                                    }
                                })
                            }else {
                                this.$Message.error("密码修改失败！");
                            }
                        })
                    }
                })
            }
        }

    }
</script>

<style scoped>

</style>
