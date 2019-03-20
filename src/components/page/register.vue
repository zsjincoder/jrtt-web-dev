<template>
    <div class="register-warp">


        <div class="register-content">

            <Card  style="background: hsla(0, 0%, 100%, .3);border: none">
                <p slot="title" class="register-title">用户注册中心</p>
                <Form ref="formLeft" :model="formLeft" label-position="left" :label-width="60" :rules="rulesData">
                    <FormItem  class="padding-input" label="用户名" prop="UserName">
                        <Input v-model="formLeft.UserName"></Input>
                    </FormItem>
                    <FormItem  class="padding-input" label="密码" prop="Password">
                        <Input v-model="formLeft.Password " type="password"></Input>
                    </FormItem>
                    <FormItem  class="padding-input" label="性别">
                        <RadioGroup style="float: left" v-model="formLeft.Sex">
                            <Radio label="1"><span>男</span></Radio>
                            <Radio label="0"><span>女</span></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem  class="padding-input" label="住址" prop="Area">
                        <Input v-model="formLeft.Area"></Input>
                    </FormItem>
                    <FormItem  class="padding-input" label="出生日期"  prop="Brithday">
                        <DatePicker style="width: 100%" type="date" v-model="formLeft.Brithday" @on-change="gerdate" format="yyyy-MM-dd"  placeholder="选择日期" ></DatePicker>
                    </FormItem>

                    <FormItem  class="padding-input" label="手机号" prop="Mobile">
                        <Input v-model="formLeft.Mobile"></Input>
                    </FormItem>

                </Form>
                <div class="group-btn">
                    <Button type="primary" @click="handleSubmit">提交</Button>
                    <Button @click="handleReset('formLeft')" >重置</Button>
                    <Button @click="goBack">返回</Button>
                </div>

            </Card>

        </div>
    </div>
</template>

<script>
    import {userRegister} from '@/api/user.js'
    import {validatePhoneNum, validateBrithday} from '@/libs/Validation.js'

    export default {
        name: "register",
        data() {
            // const valiDateUserAccount=(rule, value, callback) => {
            //             console.log(value);
            // }
            return {
                formLeft: {
                    UserName: "",
                    Password: "",
                    Sex: "",
                    Brithday:"",
                    Area:"",
                    Mobile:"",
                    UserIntroduction:"",
                    Icon:""
                },
                rulesData: {
                    UserName: [
                        {required: true, message: '请填写用户名', trigger: 'change'}
                    ],
                    Password: [
                        {required: true, message: '密码不能为空',trigger: 'change'}
                    ],
                    Brithday:[
                        {type:"string",validator: validateBrithday,trigger: 'blur'}
                    ],
                    Mobile: [{required: true, type: "string", validator: validatePhoneNum, trigger: 'blur'}]
                }
            }

        },
        methods: {
            handleSubmit() {
                this.$refs["formLeft"].validate((valid) => {
                    if (valid) {
                        userRegister(this.formLeft).then(value => {
                            console.log(value);
                            if (value.data.code == 0) {
                                this.$Message.success('Success!');
                                this.$router.push('/login')
                            }
                        }).catch(error => {

                        })

                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            gerdate(data){
                this.formLeft.Brithday = data;
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            goBack(){
                this.$router.push('/login')
            }
        }

    }
</script>

<style scoped>
    .register-warp {
        position: relative;
        text-align: center;
        width: 100%;
        height: 100%;
        padding-top: 200px;
    }

    .register-title {
        text-align: center;
        font-size: 16px;
    }

    .register-content {
        width: 500px;
        height: 300px;
        margin: 0 auto;
    }
    .padding-input{
        padding-right: 20px;
        padding-left: 20px;
    }
    .group-btn{
        text-align: center;
    }
    .group-btn button{
        width: 30%;
    }
</style>
