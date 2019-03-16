<template>
    <div>
        <div class="header ivu-card">
            <Card dis-hover>
                <Row>
                    <Col span="6">
                        <div>
                            <label>上级菜单：</label>
                            <Input v-model="headerData.MenuCode" placeholder="上级菜单名" style="width:150px"/>
                        </div>
                    </Col>
                    <Col span="6">
                        <div>
                            <label>菜单名：</label>
                            <Input v-model="headerData.ParentId" placeholder="菜单名" style="width:150px"/>
                        </div>
                    </Col>
                    <Col span="12">
                        <div style="float: right">
                            <Button type="primary" icon="ios-search" @click="Query">查询</Button>
                            <Button type="success" icon="md-add" @click="AddRole">新增</Button>
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
                    :width="item.minWidth"
                    :label="item.label">
                </el-table-column>
                <el-table-column
                    highlight-current-row=true
                    :show-overflow-tooltip='item.showOverflowTooltip'
                    v-else
                    :key="index"
                    :prop="item.prop"
                    :width="item.minWidth"
                    :label="item.label">
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="250">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button
                                size="mini"
                                title="编辑"
                                icon='el-icon-edit'
                                @click="editMenuInfo(scope.row.Id)"></el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                title="删除"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row.Id)"></el-button>
                            <el-button
                                size="mini"
                                type="primary"
                                title="分配权限"
                                icon="el-icon-sort"
                                @click="handleSetAdmin(scope.row.Id)">分配权限</el-button>
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
        <add-modify-menu v-if="isClose" :isConfig="isConfig" :rowId="rowId" :isClose="isClose" @closeUpdate="closeUpdate" @close="close"></add-modify-menu>
    </div>

</template>

<script>
    import {GetMenuList} from '@/api/menuManageApi.js'
    import addModifyMenu from './add-modify-menu.vue'
    export default {
        components:{addModifyMenu},
        name: "roleManagement",
        data() {
            return {
                roleData: [],//表格获取数据
                isClose: false,//弹窗状态值
                rowId: "",//当前行用户ID
                isConfig:false,
                headerData: {
                    MenuCode: '',
                    ParentId:''

                },
                columns: [
                    {prop:"MenuIcon",label: "菜单图标",Width: this.$golbal.littleShortWidth},
                    {prop: "MenuCode", label: "菜单ID",Width: this.$golbal.littleShortWidth},
                    {prop: "Order", label: "菜单序号", Width: this.$golbal.shortWidth},
                    {prop: "MenuTitle", label: "菜单名", Width: this.$golbal.shortWidth},
                    {prop: "RoutePath", label: "路由地址", Width: this.$golbal.shortWidth},

                ],
                pageData: {
                    pageSize: 10,//一页显示几条数据
                    pageNum: 1,//页码
                    total: 1,//总条数
                }
            }
        },
        methods: {
            getMenuList(data) {
                GetMenuList(data).then(res => {
                    if (res.data.code == 0) {
                        this.roleData = res.data.data.data;
                    }
                })
            },//获得菜单信息列表
            Query() {
                this.pageData.roleName = this.headerData.roleName;
                this.getMenuList(this.pageData);
            },//根据角色名查询角色列表
            AddRole(){
                this.isClose = true;
            },
            editMenuInfo(Id){
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
                                    this.getMenuList(this.pageData);
                                } else {
                                    this.$Message.error("删除失败");
                                }
                            })
                        }
                    }
                })

            },//删除用户
            closeUpdate() {
                this.isClose = false;//弹窗状态值
                this.getMenuList(this.pageData)
            },//关闭后刷新table
            close() {
                this.isClose = false;//弹窗状态值
            }, //关闭不刷新
            changePageSize(pageSize){
                this.pageData.pageSize = pageSize;
                this.getMenuList(this.pageData);
            },// 改变分页条数
            changeCurrentPage(pageNum){
                this.pageData.pageNum = pageNum;
                this.getMenuList(this.pageData);
            }, // 改变当前页
        },
        created() {
            this.getMenuList(this.pageData);
        }
    }
</script>

<style scoped>
    .ivu-card {
        border-radius: 0px;
    }
</style>
