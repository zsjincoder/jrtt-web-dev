<template>
    <div>
        <Modal
            v-model="isClose1"
            :closable="false"
            :mask-closable="false"
            width="400">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon style="margin-right: 5px"></Icon>
                <span>分配角色</span>
            </p>
            <RadioGroup v-model="selectRole">
                <template v-for="(item,key) in roleGroup">
                    <Radio :key="key" :label="item.Id">{{item.RoleName}}</Radio>
                </template>
            </RadioGroup>
            <!-- 自定义modal的底部 -->
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close()">关闭</Button>
                <Button type="primary" @click="_saveBtn()" :loading="loading">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {GetRoleList, GetUserRoleList, SaveUserRole} from '@/api/roleManageApi.js'

    export default {
        props: {rowId: String, isClose1: Boolean},
        name: "modify-user-info",
        data() {
            return {
                loading: false,
                roleGroup: [],
                selectRole: "",//保存当前选中用户角色的id

            }
        },
        methods: {
            getRole() {
                GetRoleList({pageSize: 10, pageNum: 1}).then(res => {
                    if (res.data.code == 0) {
                        this.roleGroup = res.data.data.data;
                    }
                });
                GetUserRoleList({userId: this.rowId}).then(res => {
                    if (res.data.code == 0) {
                        console.log(res.data.data[0].Id);
                        this.selectRole=res.data.data[0].Id;
                    }
                })
            },//得到角色列表
            _close() {
                this.$emit('close')
            },//关闭弹窗
            _saveBtn() {
                this.loading = true;
                SaveUserRole({userId:this.rowId,roleList:[this.selectRole]}).then(res => {
                    this.loading = false;
                    if (res.data.code == 0) {
                        this.$Message.success("保存成功");
                        this.$emit('closeUpdate');//
                    } else {
                        this.$Message.error("保存失败");
                    }
                })
            },//保存后关闭弹窗并更新数据

        },
        created() {
            this.getRole()
        }
    }
</script>

<style scoped>

</style>
