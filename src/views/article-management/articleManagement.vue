<template>
    <div>
        <div class="header ivu-card">
            <Card dis-hover>
                <Row>
                    <Col span="12">
                        <div>
                            <label>查询关键字：</label>
                            <Input placeholder="文章名" v-model="queryKey" style="width:150px"/>
                        </div>
                    </Col>
                    <Col span="12">
                        <div style="float: right">
                            <Button type="primary" icon="ios-search" @click="Query">查询</Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
        <div class="table-class">
            <el-table :data="articleData" border style="width: 100%">
                <el-table-column width="60" label="序号">
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
                <el-table-column label="操作" fixed="right" width="300" v-if="btns['delete-articleManagement']||btns['edit-articleMangament']">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button
                                size="mini"
                                title="编辑"
                                icon='el-icon-edit'
                                @click="editArticles(scope.row.id)" v-if="btns['edit-articleMangament']"></el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                title="删除"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row.id)" v-if="btns['delete-articleManagement']"></el-button>
                            <el-button
                                size="mini"
                                type="primary"
                                title="预览文章"
                                icon="el-icon-sort"
                                @click="handlePreivew(scope.row.id)">预览文章
                            </el-button>
                            <el-button
                                size="mini"
                                type="primary"
                                title="文章申诉"
                                icon="el-icon-sort"
                                @click="complaint(scope.row.id)" v-if="scope.row.status==1 && scope.row.userId==userId">文章申述
                            </el-button>
                            <el-button
                                size="mini"
                                type="primary"
                                title="申诉流程"
                                icon="el-icon-sort"
                                @click="appealProcess(scope.row)" v-if="scope.row.isAppeal==1">申诉流程
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
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
        <modify-articles v-if="isConfig" :isClose="isConfig" :rowId="rowId" :userId="userId" @close="closeAndUpdata"></modify-articles>
        <preview-article v-if="isConfig1" :isConfig1="isConfig1" :articleId="articleId" @closeUpdata="closeAndUpdata"></preview-article>
        <article-complaint v-if="isConfig2" :isConfig2="isConfig2" :paragraph="paragraph"  @close="closeAndUpdata" @closeUpdata="closeAndUpdata"></article-complaint>
        <appeal-process v-if="isConfig3" :isConfig3="isConfig3" :articleInfo="articleInfo" @close="closeAndUpdata"></appeal-process>
    </div>
</template>

<script>
    import {GetArticleList,DeleteArticle} from '@/api/articleManageApi.js'
    import {formatStatus,articleStatus} from '@/libs/Formatter.js'
    import {renderTime,judgeButtonRole} from '@/libs/util.js'
    import  modifyArticles from  './modifyArticle.vue'
    import  previewArticle from  './previewArticle.vue'
    import  articleComplaint from './articleComplaint.vue'
    import appealProcess  from'./appealProcess.vue'
    export default {
        name: "articleManagement",
        components:{modifyArticles,previewArticle,articleComplaint,appealProcess},
        data() {
            return {
                queryKey:"",//文章名称
                articleData: [],
                articleId:"",
                articleInfo:{},
                paragraph:"",
                userId: "",
                isConfig:false,//修改文章弹窗变量
                isConfig1:false,//预览文章弹窗变量
                isConfig2:false,//文章申述弹窗变量
                isConfig3:false,//文章申诉流程弹窗变量
                rowId:"",
                btns:{
                    "delete-articleManagement":false,
                    "edit-articleMangament":false
                },
                columns: [
                    {prop: "title", label: "文章标题", minWidth: this.$golbal.littleShortWidth,showOverflowTooltip:true},
                    {prop: "userName", label: "发表者", minWidth: this.$golbal.littleShortWidth},
                    {prop: "classifyName", label: "文章分类", minWidth: this.$golbal.littleShortWidth},
                    {prop: "channelName", label: "频道", minWidth: this.$golbal.littleShortWidth},
                    {prop: "publishedType", label: "发布状态",minWidth: this.$golbal.littleShortWidth,formatter:this.formatterStatus},
                    {prop: "status", label: "文章状态",minWidth: this.$golbal.littleShortWidth,formatter:this.formatterstatus},
                    {prop: "createTime", label: "发表时间", minWidth: this.$golbal.littleShortWidth,formatter:this.formatterCreateTime}
                ],
                pageData: {
                    total: 1,
                    pageSize: 10,
                    pageNum: 1,
                }
            }
        },
        created() {
            this.getArticleList();
            this.btns=judgeButtonRole(this.btns,this.$route.path);
            console.log(this.btns);
        },
        methods: {
            formatterStatus(row, column, cellValue, index) {
                return formatStatus(row, column, cellValue, index);
            },
            formatterstatus(row, column, cellValue, index){
              return   articleStatus(row, column, cellValue, index);
            },//格式化文章状态
            formatterCreateTime(row, column, cellValue, index){
                return  renderTime(row.createTime)
            },//格式化日期
            getArticleList() {
                let str = sessionStorage.getItem('userInfo');
                str = JSON.parse(str);
                this.userId = str.Id;
                GetArticleList(this.pageData, this.userId,this.queryKey).then(res => {
                    if (res.data.code == 0) {
                        this.articleData = res.data.data.data;
                        this.pageData.pageNum=res.data.data.pageNum;
                        this.pageData.total=res.data.data.total;
                        this.pageData.pageSize=res.data.data.pageSize;
                    }
                })
            },
            editArticles(rowId) {
                let userInfo = sessionStorage.getItem("userInfo");
                userInfo = JSON.parse(userInfo);
                this.userId = userInfo.Id;
                this.rowId=rowId;
                this.isConfig=true;
            },
            Query() {
                this.getArticleList();
            },
            handleDelete(data){
                console.log(data)
                this.$confirm('确认删除吗？', '警告', {
                    type: 'warning',
                    callback: (ac, ins) => {
                        if (ac == 'confirm') {
                            DeleteArticle(data).then(res => {
                                if (res.data.code == 0) {
                                    this.$Message.success("删除成功");
                                    this.getArticleList();
                                } else {
                                    this.$Message.error("删除失败");
                                }
                            })
                        }
                    }
                })
            },
            complaint(informId){
                this.paragraph=informId;
                this.isConfig2=true;
            },
            appealProcess(rowInfo){
                this.articleInfo=rowInfo;
                this.isConfig3=true;
            },//申诉流程
            changeCurrentPage(pageNum) {
                this.pageData.pageNum = pageNum;
                this.getArticleList(this.pageData);
            },
            changePageSize(pageSize) {
                this.pageData.pageSize = pageSize;
                this.getArticleList(this.pageData);
            },
            closeAndUpdata(){
                this.isConfig=false;
                this.isConfig1=false;
                this.isConfig2=false;
                this.isConfig3=false;
                this.getArticleList();
            },//申诉提交保存后更新回调函数
            handlePreivew(data){
                this.articleId=data;
                this.isConfig1=true;
            }
        },

    }
</script>

<style scoped>

</style>
