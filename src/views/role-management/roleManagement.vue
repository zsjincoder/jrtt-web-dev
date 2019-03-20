<template>
    <div>
        <div class="header ivu-card">
            <Card dis-hover>
                <Row>
                    <Col span="12">
                        <div>
                            <label>角色名：</label>
                            <Input v-model="headerData.roleName" placeholder="用户名" style="width:150px"/>
                        </div>
                    </Col>
                    <Col span="12">
                        <div style="float: right">
                            <Button type="primary" icon="ios-search" @click="Query">查询</Button>
                            <Button type="success" icon="md-add" @click="AddRole" v-if="btns['add-roleManagement']">新增</Button>
                        </div>

                    </Col>

                </Row>


            </Card>
        </div>
        <div class="table-class">
            <el-table
                :data="roleData"
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
                <el-table-column label="操作" fixed="right" width="250" v-if="btns['edit-roleManagement']||btns['delete-roleManagement']||btns['Assignpermissions-roleManagement']">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button
                                size="mini"
                                title="编辑"
                                icon='el-icon-edit'
                                @click="editRoleInfo(scope.row.Id)" v-if="btns['edit-roleManagement']"></el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                title="删除"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row.Id)" v-if="btns['delete-roleManagement']"></el-button>
                            <el-button
                                size="mini"
                                type="primary"
                                title="分配权限"
                                icon="el-icon-sort"
                                @click="handleSetPermissions(scope.row.Id)" v-if="btns['Assignpermissions-roleManagement']">分配权限</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="my-page">
            <Page :total="pageData.total" show-sizer show-total
                  placement="top"
                  @on-change="changeCurrentPage"
                  @on-page-size-change="changePageSize"
                  :pageSize="pageData.pageSize"
                  :current="pageData.pageNum">
            </Page>
        </div>
        <add-modify-role v-if="isClose" :isConfig="isConfig" :rowId="rowId" :isClose="isClose" @closeUpdate="closeUpdate" @close="close"></add-modify-role>
        <assign-permissions v-if="isClose1"  :rowId="rowId" :isClose1="isClose1" @closeUpdate="closeUpdate" @close="close"></assign-permissions>
    </div>

</template>

<script>
    import {GetRoleList,DeleteRole} from '@/api/roleManageApi.js'
    import {judgeButtonRole} from '@/libs/util.js'
    import addModifyRole from './add-modify-role.vue'
    import roleManagement from './roleManagement.vue'
    import assignPermissions from "./assignPermissions";
    export default {
        components:{assignPermissions, addModifyRole,roleManagement},
        name: "roleManagement",
        data() {
            return {
                roleData: [],//表格获取数据
                isClose: false,//弹窗状态值
                isClose1:false,
                rowId: "",//当前行用户ID
                isConfig:false,
                btns: {
                    'add-roleManagement':false,//角色新增
                    'edit-roleManagement':false,//角色编辑
                    'delete-roleManagement':false,//角色删除
                    'Assignpermissions-roleManagement':false//角色权限分配
                },
                headerData: {
                    roleName: '',
                },
                columns: [
                    {prop: "RoleName", label: "角色名", minWidth: this.$golbal.littleShortWidth},
                    {prop: "RoleMarke", label: "角色描述", minWidth: this.$golbal.shortWidth},
                ],
                pageData: {
                    pageSize: 10,//一页显示几条数据
                    pageNum: 1,//页码
                    total: 1,//总条数
                }
            }
        },
        methods: {
            getRoleList(data) {
                GetRoleList(data).then(res => {
                    if (res.data.code == 0) {
                        this.roleData = res.data.data.data;
                        this.pageData.pageNum=res.data.data.pageNum;
                        this.pageData.total=res.data.data.total;
                        this.pageData.pageSize=res.data.data.pageSize;
                    }
                })
            },//获得角色信息列表
            Query() {
                this.pageData.roleName = this.headerData.roleName;
                this.getRoleList(this.pageData);
            },//根据角色名查询角色列表
            AddRole(){
                this.isClose = true;
            },
            editRoleInfo(Id){
                this.rowId = Id;
                this.isConfig=true;
                this.isClose = true;
            },
            handleDelete(deletId) {
                this.$confirm('确认删除吗？', '警告', {
                    type: 'warning',
                    callback: (ac, ins) => {
                        if (ac == 'confirm') {
                            DeleteRole({userId:deletId}).then(res => {
                                if (res.data.code == 0) {
                                    this.$Message.success("删除成功");
                                    this.getRoleList(this.pageData);
                                } else {
                                    this.$Message.error("删除失败");
                                }
                            })
                        }
                    }
                })

            },//删除用户
            handleSetPermissions(data){
                this.rowId=data;
                this.isClose1=true;
            },//分配权限
            closeUpdate() {
                this.isClose = false;//弹窗状态值
                this.isClose1 = false;
                this.getRoleList(this.pageData)
            },//关闭后刷新table
            close() {
                this.isClose = false;//弹窗状态值
                this.isClose1 = false;
            }, //关闭不刷新
            changePageSize(pageSize){
                this.pageData.pageSize = pageSize;
                this.getRoleList(this.pageData);
            },// 改变分页条数
            changeCurrentPage(pageNum){
                this.pageData.pageNum = pageNum;
                this.getRoleList(this.pageData);
            }, // 改变当前页
        },
        created() {
            this.getRoleList(this.pageData);
            this.btns=judgeButtonRole(this.btns,this.$route.path)
        }
    }
</script>

<style scoped>
    .ivu-card {
        border-radius: 0px;
    }
</style>
