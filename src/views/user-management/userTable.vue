<template>
    <div>
    <div class="table-class">
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column label="序号" width="60">
                <template slot-scope="scope">
                    {{(pageData.pageNum-1)*pageData.pageSize+scope.$index+1}}
                </template>
            </el-table-column>
            <el-table-column
                highlight-current-row=true
                :show-overflow-tooltip='item.showOverflowTooltip'
                v-for="(item,index) in columns"
                v-if="item.formatter"
                :formatter="item.formatter"
                :key="index"
                :prop="item.prop"
                :min-width="item.minWidth"
                :label="item.label">
            </el-table-column>
            <el-table-column
                highlight-current-row=true
                :show-overflow-tooltip='item.showOverflowTooltip'
                v-else
                :key="index"
                :prop="item.prop"
                :min-width="item.minWidth"
                :label="item.label">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="250" v-if="btns['edit-userManagement']||btns['delete-userManagement']||btns['Designatedadministrator-userManagement']||btns['Assignroles-userManagement']">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                            size="mini"
                            title="编辑"
                            icon='el-icon-edit'
                            @click="editUserInfo(scope.row.Id)" v-if="btns['edit-userManagement']"></el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            title="删除"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row.Id)" v-if="btns['delete-userManagement']"></el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            title="指定管理员"
                            icon="el-icon-sort"
                            v-if="Flag=='1'&&btns['Designatedadministrator-userManagement']"
                            @click="handleSetAdmin(scope.row.Id)"></el-button>
                        <el-button
                            size="mini"
                            type="success"
                            title="分配角色"
                            icon="el-icon-edit-outline"
                            v-if="Flag=='0'&&btns['Assignroles-userManagement']"
                            @click="handleSetRole(scope.row.Id)">分配角色</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->

    </div>
    <div class="my-page">
        <Page :total="pageData.total" show-sizer show-total
              placement="top"
              @on-change="changeCurrentPage"
              @on-page-size-change="changePageSize"
              :pageSize="pageData.pageSize"
              :current="pageData.pageNum">
        </Page>
    </div>
    <!--弹窗-->
    <modify-user-info v-if="isClose" :rowId="rowId" :isClose="isClose" @closeUpdate="closeUpdate" @close="close"></modify-user-info>
    <prescribed-role v-if="isClose1" :rowId="rowId" :isClose1="isClose1" @close="close" @closeUpdate="closeUpdate"></prescribed-role>
    </div>
</template>

<script>
    import {GetUserList, DeleteUser, SetAdmin} from '@/api/userManageApi.js'
    import {formatSex} from '@/libs/Formatter.js'
    import {judgeButtonRole} from '@/libs/util.js'
    import modifyUserInfo from './modify-user-info.vue'
    import prescribedRole from './prescribed-role.vue'

    export default {
        components: {modifyUserInfo,prescribedRole},
        props: {querydata: Object, ifquery: Boolean, Flag: [Number, String]},
        name: "userTable",
        data() {
            return {
                isClose: false,//弹窗状态值
                isClose1:false,//弹窗1状态值
                rowId: "",//当前行用户ID
                tableData: [],//表格数据
                btns: {
                    'Assignroles-userManagement':false,//角色分配
                    'edit-userManagement':false,//编辑
                    'delete-userManagement':false,//删除
                    'Designatedadministrator-userManagement':false//指定管理员
                },
                columns: [
                    {prop: "UserName", label: "用户名", minWidth: this.$golbal.littleShortWidth},
                    {prop: "Mobile", label: "手机号", minWidth: this.$golbal.shortWidth},
                    {prop: "Sex", label: "性别", minWidth: this.$golbal.minWidth, formatter: this.formatterSex},
                    {prop: "Brithday", label: "生日", minWidth: this.$golbal.littleShortWidth},
                    {prop: "Area", label: "籍贯", minWidth: this.$golbal.littlelongWidth, showOverflowTooltip: true},
                    {
                        prop: "UserIntroduction",
                        label: "简介",
                        minWidth: this.$golbal.littlelongWidth,
                        showOverflowTooltip: true
                    },
                ],//绑定字段
                pageData: {
                    pageSize: 10,//一页显示几条数据
                    pageNum: 1,//页码
                    total: 1,//总条数
                },

            }
        },
        methods: {
            getUserInfo(data) {
                let pageData = data;
                pageData.pageSize = this.pageData.pageSize;
                pageData.pageNum = this.pageData.pageNum;
                pageData.total = this.pageData.total;
                if (this.Flag == "1") {
                    pageData.isAdmin = "0";
                } else {
                    pageData.isAdmin = "1";
                }
                GetUserList(pageData).then(res => {
                    if (res.data.code == 0) {
                        this.tableData = res.data.data.data;
                        this.pageData.pageSize=res.data.data.pageSize;
                        this.pageData.pageNum=res.data.data.pageNum;
                        this.pageData.total=res.data.data.total;

                    } else {
                        this.$Message.error("获取用户列表失败");
                    }
                })
            },//获取用户信息，根据admin获取管理员和普通用户数据
            formatterSex(row, column, cellValue, index) {
                return formatSex(row, column, cellValue, index);
            },//格式化性别
            editUserInfo(id) {
                this.rowId = id;
                this.isClose = true;

            },//调用修改弹窗
            handleDelete(deletId) {
                this.$confirm('确认删除吗？', '警告', {
                    type: 'warning',
                    callback: (ac, ins) => {
                        if (ac == 'confirm') {
                            let getdata={};
                            if (this.Flag == "0"){
                                getdata={userId: deletId,isAdmin:"1"}
                            }else {
                                getdata={userId: deletId}
                            }
                            DeleteUser(getdata).then(res => {
                                if (res.data.code == 0) {
                                    this.$Message.success("删除成功");
                                    this.getUserInfo({});
                                } else {
                                    this.$Message.error("删除失败");
                                }
                            })
                        }
                    }
                })

            },//删除用户
            handleSetAdmin(setAdminId) {
                this.$confirm('确认设置为管理员吗？', '提示', {
                    type: 'info',
                    callback: (ac, ins) => {
                        if (ac == 'confirm') {
                            SetAdmin({userId: setAdminId}).then(res => {
                                if (res.data.code == 0) {
                                    this.$Message.success("设置成功");
                                    this.getUserInfo({});
                                } else {
                                    this.$Message.error("设置失败");
                                }
                            })
                        }
                    }
                })
            },//设置普通用户为管理员
            //指定角色
            handleSetRole(Id){
                this.isClose1=true;
                this.rowId=Id;
            },
            closeUpdate() {
                this.isClose = false;//弹窗状态值
                this.isClose1=false;
                this.getUserInfo({})
            },//关闭后刷新table
            close() {
                this.isClose = false;//弹窗状态值
                this.isClose1 = false;//弹窗状态值
            }, //关闭不刷新

            changePageSize(pageSize){
                this.pageData.pageSize = pageSize;
                this.getUserInfo(this.querydata);
            },// 改变分页条数
            changeCurrentPage(pageNum){
                this.pageData.pageNum = pageNum;
                this.getUserInfo(this.querydata);
            }, // 改变当前页
        }
        ,
        created() {
            this.btns=judgeButtonRole(this.btns,this.$route.path);//按钮是否显示处理
            this.getUserInfo({});
        }
        ,
        watch: {
            ifquery(value, oldvalue) {
                if (value == true) {
                    this.getUserInfo(this.querydata);
                    this.$emit("ifQuery");
                }
            }//监听查询变量状态
        }
    }
</script>

<style scoped>
</style>
