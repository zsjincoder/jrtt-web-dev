<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">新闻App后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!-- 用户头像 -->
                <div class="user-avator"><img :src="newuserInfo.Icon"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{newuserInfo.UserName}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="modifyPwd">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <modif-user-data v-if="Flag" :modFlag="Flag" @updateData="update" @cancel="cancelBalck"></modif-user-data>
        <modify-pass-word v-show="Flag1" :modFlag1="Flag1" @cancel1="cancelBalck1"></modify-pass-word>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import ModifUserData from "../page/modifUserData";
    import modifyPassWord from "../page/modifyPassWord";

    export default {
        components: {ModifUserData, modifyPassWord},
        data() {
            return {
                collapse: false,
                fullscreen: false,
                Flag: false,
                Flag1: false,
                message: 2,
                data: "",//临时存储userInfo
            }
        },
        created() {
            this.updateUserInfo();
        },
        computed: {
            newuserInfo: function () {
                let userInfoString = this.data;
                return JSON.parse(userInfoString)
            }
        },
        methods: {
            //更新seession里的userInfo
            updateUserInfo() {
                this.data = sessionStorage.getItem("userInfo");
            },
            update() {
                window.location.reload(true);
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command == 'loginout') {//点击退出登陆执行
                    localStorage.removeItem('ms_username');
                    sessionStorage.clear()
                    this.$router.push('/login');
                } else if (command == 'userinfo') {//点击个人中心执行
                    this.Flag = true;
                } else if (command == 'modifyPwd') {//点击修改密码执行
                    this.Flag1 = true;
                }
            },
            //相应子组件modifUserData.vue的取消并关闭修改资料弹窗
            cancelBalck() {
                this.Flag = false;
            },
            cancelBalck1() {
                this.Flag1 = false;
            },
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            //修改资料成功返回并更新主页
            updateData() {

            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }

    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }

    .header .logo {
        float: left;
        width: 250px;
        line-height: 70px;
    }

    .header-right {
        float: right;
        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        height: 70px;
        align-items: center;
    }

    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }

    .btn-bell, .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }

    .btn-bell-badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }

    .btn-bell .el-icon-bell {
        color: #fff;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avator {
        margin-left: 20px;
    }

    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>
