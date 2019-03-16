<template>
    <div class="register-warp">


        <div class="register-content">

            <Card >
                <p slot="title" class="register-title">用户注册中心</p>
                <Form ref="formLeft" :model="formLeft" label-position="left" :label-width="60" :rules="rulesData">
                    <FormItem label="用户名" prop="UserName">
                        <Input v-model="formLeft.UserName"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="Password">
                        <Input v-model="formLeft.Password " type="password"></Input>
                    </FormItem>
                    <FormItem label="性别" prop="Sex">
                        <Input v-model="formLeft.Sex "></Input>
                    </FormItem>
                    <FormItem label="出生日期">
                        <DatePicker type="date" @on-change="gerdate" format="yyyy-MM-dd"  placeholder="Select date" ></DatePicker>
                    </FormItem>
                    <FormItem label="住址" prop="Area">
                        <Input v-model="formLeft.Area"></Input>
                    </FormItem>
                    <FormItem label="手机号码" prop="Mobile">
                        <Input v-model="formLeft.Mobile"></Input>
                    </FormItem>
                        <Button type="primary" @click="handleSubmit">注册</Button>
                        <Button @click="handleReset" style="margin-left: 8px">重置</Button>
                </Form>
            </Card>

        </div>
    </div>
</template>

<script>
    import {userRegister} from '@/api/user.js'

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
                        {required: true, message: 'The name cannot be empty', trigger: 'change'}
                    ],
                    Password: [
                        {required: true, message: 'The password cannot be empty',}
                    ]
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
            handleReset() {

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

</style>
