<template>
    <div>
        <Modal
            v-model="isClose1"
            :closable="false"
            :mask-closable="false"
            width="900">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon style="margin-right: 5px"></Icon>
                <span>分配权限</span>
            </p>
            <el-table
                :data="data1"
                stripe
                border
                style="width: 100%">
                <el-table-column
                    prop="MenuTitle"
                    label="主菜单"
                    width="180">
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="parentBoxData" @change="changeParentBox">
                            <el-checkbox :label="scope.row.Id">{{scope.row.MenuTitle}}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-table-column>
                <el-table-column
                    label="子菜单"
                    width="180">
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="childBoxData" @change="changeChildBox">
                            <div v-if="scope.row.childmenulist.length > 0" v-for="item in scope.row.childmenulist"
                                 class="childNode">
                                <el-checkbox :label="item.Id">{{item.MenuTitle}}</el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </template>
                </el-table-column>
                <el-table-column
                    label="按钮权限">
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="buttonData" @change="changeButton">
                            <div v-if="scope.row.childmenulist.length > 0" v-for="item in scope.row.childmenulist"
                                 class="childNode">
                                <template v-if="item.button.length > 0" v-for="list in item.button">
                                    <el-checkbox :label="list.buttonId">{{list.buttonName}}</el-checkbox>
                                </template>
                            </div>
                        </el-checkbox-group>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 自定义modal的底部 -->
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close()">关闭</Button>
                <Button type="primary" @click="_saveBtn('formData')" :loading="loading">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {GetMenuList,saveRoleHaveMenu,queryRoles} from '@/api/menuManageApi.js'
    import {getAllButton} from '@/api/buttonManageApi.js'

    export default {
        props: {rowId: String, isClose1: Boolean},
        name: "assignPermissions",
        data() {
            return {
                loading: false,
                title: "新增",
                parentList: [],
                buttonList: [],
                parentBoxData: [],
                childBoxData: [],
                buttonData: [],
                parentMenuId: {},
                data2: [],
                data1: [],//表格数据
            }
        },
        created() {
            this.getParentMenuLsit();
            queryRoles({roleId:this.rowId}).then(res =>{
                if(res.data.code == 0){
                    this.parentBoxData = res.data.data.parentMenuList != null?res.data.data.parentMenuList:[];
                    this.childBoxData = res.data.data.childMenuList != null?res.data.data.childMenuList:[];
                    this.buttonData = res.data.data.buttonList!= null?res.data.data.buttonList:[];
                }
            })
        },
        methods: {
            getParentMenuLsit() {
                GetMenuList().then(res => {
                    if (res.data.code == 0) {
                        this.parentList = res.data.data;
                        getAllButton().then(res => {
                            if (res.data.code == 0) {
                                this.buttonList = res.data.data;
                                this.ParentNode();
                            }
                        })
                    }
                });

            },
            ParentNode() {
                let dataList = [];
                for (let i = 0; i < this.parentList.length; i++) {
                    let key = {};
                    if (this.parentList[i].ParentId == '/') {
                        key.Id = this.parentList[i].Id;
                        key.MenuTitle = this.parentList[i].MenuTitle;
                        dataList = this.childNode(this.parentList[i].Id);
                        if (dataList.length > 0) {
                            key.childmenulist = dataList;
                        }
                        ;
                        this.data1.push(key)
                    }
                }
            },
            childNode(parentId) {
                let childmenulist = [];
                let dataList = [];
                for (let i = 0; i < this.parentList.length; i++) {
                    let key = {};
                    if (this.parentList[i].ParentId == parentId) {
                        key.Id = this.parentList[i].Id;
                        key.MenuTitle = this.parentList[i].MenuTitle;
                        dataList = this.buttonNode(this.parentList[i].Id);
                        if (dataList.length > 0) {
                            key.button = dataList
                        }
                        childmenulist.push(key)
                    }
                }
                return childmenulist
            },
            buttonNode(childMenuId) {
                let buttonList = [];
                for (let i = 0; i < this.buttonList.length; i++) {
                    let key = {};
                    if (this.buttonList[i].menu_id == childMenuId) {
                        key.buttonName = this.buttonList[i].button_name;
                        key.buttonId = this.buttonList[i].id;
                        buttonList.push(key)
                    }

                }
                return buttonList
            },
            changeParentBox(item) {
                this.childBoxData = [];
                this.buttonData = [];
                if (item.length > 0) {
                    for (let i = 0; i < item.length; i++) {
                        for (let j = 0; j < this.data1.length; j++) {
                            if (item[i] == this.data1[j].Id) {
                                if (this.data1[j].childmenulist && this.data1[j].childmenulist.length > 0) {
                                    for (let x = 0; x < this.data1[j].childmenulist.length; x++) {
                                        this.childBoxData.push(this.data1[j].childmenulist[x].Id)
                                        if (this.data1[j].childmenulist[x].button && this.data1[j].childmenulist[x].button.length > 0) {
                                            for (let y = 0; y < this.data1[j].childmenulist[x].button.length; y++) {
                                                this.buttonData.push(this.data1[j].childmenulist[x].button[y].buttonId)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            changeChildBox(item) {
            },//测试数据保留
            changeButton() {
            },//测试数据保留
            _close() {
                this.$emit("close")
            },
            _saveBtn() {
                this.data2 = [];
                if (this.parentBoxData.length > 0) {
                    for (let i = 0; i < this.parentBoxData.length; i++) {
                        for (let j = 0; j < this.data1.length; j++) {
                            if (this.parentBoxData[i] == this.data1[j].Id) {
                                if (this.data1[j].childmenulist && this.data1[j].childmenulist.length > 0) {
                                    for (let x = 0; x < this.data1[j].childmenulist.length; x++) {
                                        let parentData = {
                                            menuId:"",
                                            buttonList:[]
                                        }
                                        if(this.childBoxData.indexOf(this.data1[j].childmenulist[x].Id) !== -1){
                                            parentData.menuId = this.data1[j].childmenulist[x].Id;
                                        }
                                        if (this.data1[j].childmenulist[x].button && this.data1[j].childmenulist[x].button.length > 0) {
                                            for (let y = 0; y < this.data1[j].childmenulist[x].button.length; y++) {
                                                if(this.buttonData.indexOf(this.data1[j].childmenulist[x].button[y].buttonId) !== -1){
                                                    parentData.buttonList.push({buttonId:this.data1[j].childmenulist[x].button[y].buttonId})
                                                }
                                                //this.buttonData.push(this.data1[j].childmenulist[x].button[y].buttonId)
                                            }
                                        }
                                        if (parentData.menuId != ""){
                                            this.data2.push(parentData)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                saveRoleHaveMenu({roleId:this.rowId,menuList:this.data2}).then(res =>{
                    if(res.data.code == 0){
                        this.$emit("close")
                        this.$Message.success("操作成功")
                    }else {
                        this.$Message.error(res.data.msg)
                    }
                })
            }
        }

    }
</script>

<style>
    .childNode {
        width: 100%;
        height: 35px;
        border: 1px #d8dadf solid;
        padding: 2px;
        text-align: left;
        line-height: 30px;
    }
</style>
