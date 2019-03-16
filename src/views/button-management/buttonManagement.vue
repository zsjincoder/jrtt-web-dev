<template>
    <div>
        <div class="header ivu-card">
            <Card dis-hover>
                <Row>
                    <Col span="12">
                        <div>
                            <label>所属菜单：</label>
                            <Input v-model="headerData.menuTitle" placeholder="用户名" style="width:150px"/>
                        </div>
                    </Col>
                    <Col span="12">
                        <div style="float: right">
                            <Button type="primary" icon="ios-search" @click="Query">查询</Button>
                            <Button type="success" icon="md-add" @click="AddButton">新增</Button>
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
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button
                                size="mini"
                                title="编辑"
                                icon='el-icon-edit'
                                @click="editButtonInfo(scope.row.Id)"></el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                title="删除"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row.Id)"></el-button>
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
        <add-modify-button v-if="isClose" :isConfig="isConfig" :rowId="rowId" :isClose="isClose" @closeUpdate="closeUpdate" @close="close"></add-modify-button>
    </div>

</template>

<script>
    import {GetButtionList,DeleteButton}from '@/api/buttonManageApi.js'
    import  addModifyButton from './add-modify-button.vue'
    export default {
        components:{addModifyButton},
        name: "roleManagement",
        data() {
            return {
                roleData: [],//表格获取数据
                isClose: false,//弹窗状态值
                rowId: "",//当前行用户ID
                isConfig:false,
                headerData: {
                    menuTitle: '',
                },
                columns: [
                    {prop: "ButtonCode", label: "按钮编码", minWidth: this.$golbal.littleShortWidth},
                    {prop: "ButtonName", label: "按钮名称", minWidth: this.$golbal.shortWidth},
                    {prop: "ButtonPath", label: "按钮路由", minWidth: this.$golbal.shortWidth},
                    {prop: "MenuTitle", label: "所属菜单", minWidth: this.$golbal.shortWidth},
                    {prop: "ButtonDescription", label: "按钮功能描述", minWidth: this.$golbal.shortWidth}
                ],
                pageData: {
                    pageSize: 10,//一页显示几条数据
                    pageNum: 1,//页码
                    total: 1,//总条数
                }
            }
        },
        methods: {
            getButtonList(data) {
                GetButtionList(data).then(res => {
                    if (res.data.code == 0) {
                        this.roleData = res.data.data.data;
                        this.pageData.pageNum=res.data.data.pageNum;
                        this.pageData.total=res.data.data.total;
                        this.pageData.pageSize=res.data.data.pageSize;
                    }
                })
            },//获得角色信息列表
            Query() {
                this.pageData.menuTitle = this.headerData.menuTitle;
                this.getButtonList(this.pageData);
            },//根据角色名查询角色列表
            AddButton(){
                this.isConfig=false;
                this.isClose = true;
            },
            editButtonInfo(Id){
                this.rowId = Id;
                this.isConfig=true;
                this.isClose = true;
            },
            handleDelete(deletId) {
                this.$confirm('确认删除吗？', '警告', {
                    type: 'warning',
                    callback: (ac, ins) => {
                        if (ac == 'confirm') {
                            DeleteButton(deletId).then(res => {
                                if (res.data.code == 0) {
                                    this.$Message.success("删除成功");
                                    this.getButtonList(this.pageData);
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
                this.getButtonList(this.pageData)
            },//关闭后刷新table
            close() {
                this.isClose = false;//弹窗状态值
            }, //关闭不刷新
            changePageSize(pageSize){
                this.pageData.pageSize = pageSize;
                this.getButtonList(this.pageData);
            },// 改变分页条数
            changeCurrentPage(pageNum){
                this.pageData.pageNum = pageNum;
                this.getButtonList(this.pageData);
            }, // 改变当前页
        },
        created() {
            this.getButtonList(this.pageData);
        }
    }
</script>

<style scoped>
    .ivu-card {
        border-radius: 0px;
    }
</style>
