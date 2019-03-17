<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="userName">
                    <el-input v-model="ruleForm.userName" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <div class="register-btn">
                    <el-button type="success" @click="registerForm">注册</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {userLogin} from '@/api/user.js'

    export default {
        data: function () {
            return {
                ruleForm: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        userLogin(this.ruleForm).then(res => {
                            if (res.data.code == 0) {
                                let MenuList = [];
                                let parentList = [];
                                let menuData = res.data.data.menuList;
                                menuData.map((item) => {
                                    if (item.parentId != "" && parentList.indexOf(item.parentId) == -1){
                                        parentList.push(item.parentId)
                                        let data ={
                                            icon:item.parentIcon,
                                            index:item.parentPath,
                                            title:item.parnetTitle,
                                        }
                                        let childMenu = this.getChildMenu(item.parentId ,menuData);
                                        if (childMenu.length >0){
                                            data.subs = childMenu
                                        }
                                        MenuList.push(data)
                                    }
                                });
                                sessionStorage.setItem("MenuList", JSON.stringify(MenuList));
                                sessionStorage.setItem("ButtonList", JSON.stringify(res.data.data.buttonList));
                                sessionStorage.setItem("token", res.data.data.token);
                                sessionStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo));
                                this.$router.push('/dashboard');
                            } else {
                                this.$Message.error("登陆失败");
                            }
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            registerForm() {
                console.log(123);
                this.$router.push('/register')
            },
            //获取菜单列表
            getChildMenu(id ,menuData) {
                let childMenu = []
                menuData.map(item =>{
                   if(item.parentId == id){
                       let data ={
                           index:item.routePath,
                           title:item.menuTitle,
                           icon:item.menuIcon,
                       }
                       childMenu.push(data)
                   }
                });
                return childMenu
            }

        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .ms-title {
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -230px;
        text-align: center;
        font-size: 30px;
        color: #fff;

    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 300px;
        height: max-content;
        margin: -150px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }

    .register-btn button {
        width: 100%;
        height: 36px;
        margin-top: 10px;
    }
</style>
