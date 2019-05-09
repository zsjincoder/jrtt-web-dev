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
            <Table :columns="columns" :data="commentData" border></Table>
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
        <article-appeals-window :isConfig="conFig" :commentId="commentId" @config="close" @colseUpdata="close"></article-appeals-window>
        <article-appeals-schedule  :isConfig="conFig1" :checkInfo="checkInfo" @close="close"></article-appeals-schedule>
    </div>
</template>
<script>
    import {GetComment, DealComment, DeleteComment} from '@/api/commentManageApi.js'
    import {GetAppealInfo,DealAppealInfo,deleteAppeal} from '@/api/articleappealesManageApi.js'
    import {renderTime} from '@/libs/util.js'
    import articleAppealsWindow from './articleAppealsWindow.vue'
    import articleAppealsSchedule from './articleAppealsSchedule.vue'
    // import articleReviewWindow from './articleReviewWindow.vue'
    // import articleReviewSchedule from './articleReviewSchedule.vue'
    export default {
        name: "articleAppeals",
        // components: { articleReviewSchedule,articleReviewWindow},
        components: {articleAppealsWindow,articleAppealsSchedule},
        data() {
            return {
                switchData: false,
                queryKey: "",//文章名称
                commentData: [],
                conFig: false,//审核弹窗控制变量
                conFig1: false,//查看进度弹窗控制变量
                checkInfo:{},
                informType: "1",//举报类型变量
                userId: "",
                commentId: "",
                columns: [
                    {
                        title:"序号",
                        width:60,
                        render:(h,params)=>{
                            console.log(params);
                            let Page=(this.pageData.pageNum-1)*this.pageData.pageSize+params.index+1;
                            return h('span',{},Page);
                        }
                    },
                    {title: "申诉文章", key: 'articleTitle'},
                    {title: "申诉人", key: 'appealUserName'},
                    {title: "类型", key: 'informTitle'},
                    {
                        title: "申诉时间",
                        render: (h, params) => {
                            let L = renderTime(params.row.createTime);
                            return h('span', {}, L);
                        }
                    },
                    {title: "申诉内容", key: 'appealContent'},
                    {title: "举报内容", key: 'informContent'},
                    {
                        title: "状态",
                        render: (h, params) => {
                            if (params.row.status == "0") {
                                return h('Tag', {
                                    props: {color: 'primary'}
                                }, '未处理')
                            } else if (params.row.status == "1") {
                                return h('Tag', {
                                    props: {color: 'warning'}
                                }, '处理中')
                            } else if (params.row.status == "2") {
                                return h('Tag', {
                                    props: {color: 'success'}
                                }, '处理完成')
                            }
                        }
                    },
                    {
                        title: "操作",
                        render: (h, params) => {
                            if (params.row.status == "0") {
                                return h('div', {style: {paddingLeft: 2}}, [
                                    h('Button', {
                                        props: {size: 'small'},
                                        style: {marginRight: "15px"},
                                        on: {
                                            click: () => {
                                                this.dealComment(params.row.id);
                                            }
                                        }
                                    }, '确认处理'),
                                    h('Button', {
                                        props: {size: 'small', type: 'primary'},
                                        on: {
                                            click: () => {
                                                this.dealComment1(params.row);
                                            }
                                        }
                                    }, '查看'),
                                ])
                            } else if (params.row.status == "1" && params.row.handlerUserId == this.userId) {
                                return h('div', {}, [
                                    h('Button', {
                                        props: {size: 'small', type: 'warning'},
                                        style: {marginRight: "15px"},
                                        on: {
                                            click: () => {
                                                this.dealComment(params.row.id);
                                            }
                                        }
                                    }, '处理'),
                                    h('Button', {
                                        props: {size: 'small', type: 'primary'},
                                        on: {
                                            click: () => {
                                                this.dealComment1(params.row);
                                            }
                                        }
                                    }, '查看'),
                                ])
                            } else if (params.row.status == "2") {
                                return h('div', {}, [
                                    h('Button', {
                                        props: {size: 'small', type: 'primary'},
                                        on: {
                                            click: () => {
                                                this.dealComment1(params.row);
                                            }
                                        }
                                    }, '查看'),
                                ])
                            }
                        }
                    }
                ],
                pageData: {
                    total: 1,
                    pageSize: 10,
                    pageNum: 1,
                }
            }
        },
        created() {
            this.getReviewList();
        },
        methods: {
            getReviewList() {
                let Info=sessionStorage.getItem('userInfo');
                Info=JSON.parse(Info);
                this.userId=Info.Id;
                GetAppealInfo(this.pageData).then(res => {
                    if (res.data.code == 0) {
                        if( res.data.data.data==null){
                            this.commentData=[];
                        }else {
                            this.commentData = res.data.data.data;
                        }
                    }
                })
            },

            Query() {
                this.getReviewList(this.queryKey);
            },
            dealComment(rowId) {
                DealAppealInfo({handlerId: this.userId, appealId : rowId}).then(res => {
                    this.getReviewList();
                    this.commentId = rowId;
                    this.conFig = true;
                });
            },//处理弹窗打开
            dealComment1(info) {
                this.checkInfo = info;
                this.conFig1 = true;
            },//查看进度弹窗打开
            handleDelete(data) {
                console.log(data)
                this.$confirm('确认删除吗？', '警告', {
                    type: 'warning',
                    callback: (ac, ins) => {
                        if (ac == 'confirm') {
                            deleteAppeal({appealId : data}).then(res => {
                                if (res.data.code == 0) {
                                    this.$Message.success("删除成功");
                                    this.getReviewList();
                                } else {
                                    this.$Message.error("删除失败");
                                }
                            })
                        }
                    }
                })
            },
            close() {
                this.conFig = false;
                this.conFig1 = false;
                this.getReviewList();
            },
            changeCurrentPage(pageNum) {
                this.pageData.pageNum = pageNum;
                this.getReviewList();
            },
            changePageSize(pageSize) {
                this.pageData.pageSize = pageSize;
                this.getReviewList();
            },

        },

    }
</script>

<style scoped>

</style>
