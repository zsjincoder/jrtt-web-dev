<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">新闻后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item class="pading-input" prop="userName">
                    <span style="margin-right: 5px">用户名：</span>
                    <el-input v-model="ruleForm.userName" placeholder="用户名">
                        <template slot="prepend"></template>
                    </el-input>
                </el-form-item>
                <el-form-item class="pading-input" prop="password">
                    <span style="margin-right: 5px;">密<span style="visibility: hidden">空</span>码：</span>
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn pading-button">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <div class="login-btn pading-button">
                    <el-button type="success" @click="registerForm">注册</el-button>
                </div>
            </el-form>
            <el-input style="visibility: hidden"   placeholder="用户名">

            </el-input>
            <el-input style="visibility: hidden"   placeholder="用户名">

            </el-input>
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
                                    if (item.parentId =='/' && parentList.indexOf(item.id) == -1) {
                                        parentList.push(item.id)
                                        let data = {
                                            index: item.routePath,
                                            title: item.menuTitle,
                                            icon: item.menuIcon,
                                        };
                                        let childMenu = this.getChildMenu(item.id, menuData);
                                        if (childMenu.length > 0) {
                                            data.subs = childMenu
                                        }
                                        console.log(data);
                                        MenuList.push(data)
                                    }
                                });
                                sessionStorage.setItem("MenuList", JSON.stringify(MenuList));
                                sessionStorage.setItem("ButtonList", JSON.stringify(res.data.data.buttonList));
                                sessionStorage.setItem("token", res.data.data.token);
                                sessionStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo));
                                this.$router.push('/userManagement');
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
                this.$router.push('/register')
            },
            //获取菜单列表
            getChildMenu(id, menuData) {
                let childMenu = []
                menuData.map(item => {
                    if (item.parentId == id) {
                        let data = {
                            index: item.routePath,
                            title: item.menuTitle,
                            icon: item.menuIcon,
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
        background: url("/static/img/dl.jpg") no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 100%;
    }
    .el-input{
        width: 80%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 44%;
        top: 50%;
        width: 547px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: hsla(0, 0%, 100%, .3);
        overflow: hidden;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 90%;
    }

    .pading-input {
        margin-top: 20px;
        padding-left: 30px;
        padding-right: 30px
    }

    .pading-button {
        padding-left: 30px;
        padding-right: 30px;
        margin-top: 5px;
    }
</style>

<style lang="css">

</style>
