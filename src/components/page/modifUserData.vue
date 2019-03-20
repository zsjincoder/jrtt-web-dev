<template>
    <div>
        <Drawer
            title="修改个人资料"
            v-model="modFlag"
            width="720"
            :mask-closable="false"
            :closable="false"
            :styles="styles"
        >
            <Form ref="userData" :model="userData" :rules="ruleValidate" :label-width="60">
                <Row>
                    <Col span="24">
                        <div class="demo-upload-list">
                            <img :src="userData.Icon">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(userData.Icon)"></Icon>
                            </div>

                        </div>

                        <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :before-upload="handleBeforeUpload"
                            type="drag"
                            action="/"
                            style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                        <span v-if="newFile!==null">已选择{{newFile.name}}</span>
                        <Modal title="预览" v-model="visible">
                            <img :src="userData.Icon" v-if="visible" style="width: 100%">
                        </Modal>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="用户名" prop="UserName">
                            <Input v-model="userData.UserName"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="性别">
                            <RadioGroup v-model="userData.Sex">
                                <Radio label="1"><span>男</span></Radio>
                                <Radio label="0"><span>女</span></Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="手机号" prop="Mobile">
                            <Input v-model="userData.Mobile"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="生日" prop="Brithday">
                            <DatePicker size="large" type="date" format="yyyy-MM-dd" @on-change="getDate" v-model="userData.Brithday" placeholder="选择日期"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="住址">
                            <Input v-model="userData.Area"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="个人简介">
                            <Input type="textarea" :rows="20" v-model="userData.UserIntroduction"></Input>
                        </FormItem>
                    </Col>
                </Row>

            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="cancel">取消</Button>
                <Button type="primary" @click="saveuserInfo('userData')">确定</Button>
            </div>
        </Drawer>

    </div>
</template>

<script>
    import {validatePhoneNum, validateBrithday} from '@/libs/Validation.js'
    import {ModifyUserInfo} from '@/api/userManageApi.js'

    export default {
        name: "ModifUserData",
        props: {modFlag: Boolean},
        data() {
            return {
                newdate: "",//处理后的日期格式
                userData: {},
                newFile: null,
                //测试头像上传部分开始
                visible: false,
                //测试头像上传部分结束
                ruleValidate: {
                    UserName: [{required: true, type: "string", message: "请输入姓名", trigger: 'blur'}],
                    Mobile: [{required: true, type: "string", validator: validatePhoneNum, trigger: 'blur'}],
                    Brithday: [{type: "string", validator: validateBrithday, trigger: 'blur'}]
                },//验证字段
                styles: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
            }
        },
        methods: {
            getuserInfo() {
                let data = sessionStorage.getItem("userInfo");
                this.userData = JSON.parse(data);
                this.newdate = this.userData.Brithday;
            },//初始化加载用户信息
            saveuserInfo(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.userData.Brithday = this.newdate;
                        let fileData = new FormData;
                        for (let key in this.userData) {
                            fileData.append(key, this.userData[key]);
                        }
                        if (this.newFile !== null) {
                            fileData.append('iconFile', this.newFile);
                        }
                        ModifyUserInfo(fileData).then(res => {
                            if (res.data.code == 0) {
                                console.log(res);
                                console.log(JSON.stringify(res.data.data.userInfo));
                                sessionStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo));
                                this.$emit("updateData");
                                this.$Message.success("保存成功");
                                this.cancel();
                            } else {
                                this.$Message.error("修改失败");
                            }
                        })

                    }
                })


            },//保存用户信息
            getDate(value) {
                this.newdate = value;

            },//设置日期格式为yyy-MM-dd
            cancel() {
                this.$emit("cancel");
            },
            //测试头像上传部分开始
            handleView(url) {
                this.visible = true;
            },
            handleBeforeUpload(file) {
                this.newFile = file;
                return false;
            },
            //测试头像上传部分结束

        },
        created() {
            this.getuserInfo();
        },

    }
</script>

<style scoped>
    /*取消确定footer样式*/
    .demo-drawer-footer {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }

    /*头像上传代码*/
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
