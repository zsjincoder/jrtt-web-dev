<template lang="html">
    <div class="add-new-role-wrapper">
        <Modal
            v-model="controllModal"
            :closable="false"
            :mask-closable="false"
            class="add-new-role"
            width="400"
            class-name="vertical-center-modal">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon :type="iconType" style="margin-right: 5px"></Icon>
                <span>{{modalTitle}}</span>
            </p>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
                <FormItem label="姓名" prop="Name">
                    <Input v-model="formData.Name"  placeholder="请输入姓名"></Input>
                </FormItem>
                <FormItem label="性别" prop="Sex">
                    <Input v-model="formData.Sex" placeholder="请输入性别"></Input>
                </FormItem>
                <FormItem label="系别" prop="Department">
                    <Input v-model="formData.Department" placeholder="请输入系别"></Input>
                </FormItem>

            </Form>
            <!-- 自定义modal的底部 -->
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close('formData')">关闭</Button>
                <Button type="primary" @click="_saveBtn('formData')" :loading="loading">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {GetStudentInfo} from '@/api/user.js'

    export default {
        props: {controllModal: Boolean, isModify: Boolean, id: String},
        data() {
            return {
                loading: false,
                modalTitle: '新增',
                iconType: 'plus-round',
                formData: {
                    Name: '',
                    Sex: '',
                    Department: '',
                },
                ruleValidate: {
                    Name: [
                        {required: true, type: 'string', message: '请输入姓名', trigger: 'blur'},
                    ],
                    Sex: [
                        {required: true, type: 'string', message: '请输入性别', trigger: 'blur'}
                    ],
                    Department: [
                        {required: true, type: 'string', message: '请输入系别', trigger: 'blur'}
                    ]
                },

            }
        },
        mounted() {
            this.openModal();
        },
        methods: {
            // 保存角色的方法
            saveNewRoleFn(options) {

            },
            // 打开弹窗
            openModal() {
                if (this.isModify) {
                    this.modalTitle = "编辑"
                    this.getFromData();
                } else {
                    this.modalTitle = "新增"
                }
            },
            //获取当前行数据
            getFromData() {
                GetStudentInfo({studentId: this.id}).then(res => {
                    this.formData = res.data.data;
                })
            },
            // 点击关闭弹窗,清空验证标识
            _close(name) {
                this.$emit('on-action-modal', !this.controllModal);
            },
            // 点击保存关闭弹窗
            _saveBtn(name) {
                let self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let options = {};
                        options.roleName = self.formData.roleName;
                        options.status = self.formData.status;
                        options.roleDescription = self.formData.roleDescription;
                        self.saveNewRoleFn(options);
                    } else {
                        this.$Message.error('必填项不能为空');
                    }
                });
            }
        }
    }
</script>

<style scoped>
</style>
<style>
    .add-new-role .ivu-modal-body {
        padding: 16px 52px 16px 20px;
    }
</style>
