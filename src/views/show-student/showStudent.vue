<template>
    <div>
        <div class="manger-roles-wrapper">
            <my-header @showModal="openAddNewModal" @getUserRealName="_getUserName" @search="_search"></my-header>
            <div class="table-class">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
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
                                    @click="editNotice(scope.$index, scope.row)"></el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    title="删除"
                                    icon="el-icon-delete"
                                    @click="handleDelete(scope.$index, scope.row)"></el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
            <div class="my-page">
                <Page :total="pageData.total" show-sizer show-total
                      @on-change="changeCurrentPage"
                      @on-page-size-change="changePageSize"
                      :pageSize="pageData.pageSize"
                      :current="pageData.pageNum">
                </Page>
            </div>

            <!-- 加载状态 -->
            <div class="myLoading">
                <my-loading v-if="showLoading"></my-loading>
            </div>
            <!-- 新增弹窗 -->
            <add-new-student v-if="controllModal" :controllModal="controllModal" :isModify="isModify" :id="id" @on-action-modal="closeModal"></add-new-student>

        </div>
    </div>
</template>

<script>
    import myHeader from './myHeader.vue';
    import addNewStudent from './add-new-modal.vue';
    import myLoading from '@/components/loading/loading.vue';
    import {GetStudentInfo} from '@/api/user.js'
    export default {
        name: "showStudent",
        components:{myHeader,myLoading,addNewStudent},
        data(){
            return{
                showLoading:false,
                controllModal:false,
                isModify:false,
                id:'',
                searchData:{
                    studentName:''
                },
                tableData:[],
                columns:[
                    {prop:'Id', label:'id', minWidth:150},
                    {prop:'Name', label:'姓名', minWidth:150},
                    {prop: 'Sex', label:'性别', minWidth:150},
                    {prop: 'Department', label:'系别', minWidth:150},
                    {prop: 'Birth', label:'出生日期', minWidth:150},
                    {prop:'Address', label:'地址', minWidth: 200, showOverflowTooltip:true},
                ],
                pageData:{
                    total:1,
                    pageNum:1,
                    pageSize:10,
                }
            }
        },
        created(){
          this.getTableData()
        },
        methods:{
            getTableData(data){
                this.showLoading = true;
                GetStudentInfo(data).then(res=>{
                    this.showLoading = false;
                    if(res.data.code == 0){
                        this.tableData = res.data.data;
                    }else {
                        this.$Message.error("系统错误")
                    }
                })
            },
            //打开新增编辑窗口
            openAddNewModal(){
                this.controllModal = true;
                this.isModify = false;
            },
            closeModal(){
                this.controllModal = false;
            },
            //编辑
            editNotice(index , row){
                this.id = row.Id.toString();
                this.controllModal = true;
                this.isModify = true;
            },
            //删除
            handleDelete(index , row){

            },
            //获取用户名
            _getUserName(val){
                this.searchData.studentName = val;
            },
            //搜索按钮
            _search(){
                this.getTableData(this.searchData);
            },
            // 改变分页条数
            changePageSize(pageSize){
                this.pageData.pageSize = pageSize;
                this._search();
            },
            // 改变当前页
            changeCurrentPage(pageNum){
                this.pageData.pageNum = pageNum;
                this._search();
            },
        }
    }
</script>

<style scoped>

</style>
