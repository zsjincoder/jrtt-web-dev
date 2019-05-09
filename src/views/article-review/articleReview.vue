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
        <article-review-window :isConfig="conFig" :commentId="commentId" @config="close" @colseUpdata="close"></article-review-window>
        <article-review-schedule  :isConfig="conFig1" :checkInfo="checkInfo" @close="close"></article-review-schedule>
    </div>
</template>
<script>
    import {GetComment, DealComment, DeleteComment} from '@/api/commentManageApi.js'
    import {renderTime} from '@/libs/util.js'
    import articleReviewWindow from './articleReviewWindow.vue'
    import articleReviewSchedule from './articleReviewSchedule.vue'

    export default {
        name: "articleManagement",
        components: { articleReviewSchedule,articleReviewWindow},
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
                btns:{
                    'confirm-handle':false,//按钮确认处理
                    'confirm-delete':false,//按钮删除
                },
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
                    {title: "被举报文章", key: 'articleTitle',tooltip:true},
                    {title: "文章作者", key: 'articleUserName'},
                    {title: "举报人", key: 'informerName'},
                    {title: "类型", key: 'informTitle'},
                    {
                        title: "举报时间",
                        render: (h, params) => {
                            let L = renderTime(params.row.createTime);
                            return h('span', {}, L);
                        }
                    },
                    {title: "内容", key: 'informContent',tooltip:true},
                    {title: "备注", key: 'remark',tooltip:true},
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
                            } else if (params.row.status == "1" && params.row.handlerId == this.userId) {
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
                                        props: {size: 'small', type: 'error'},
                                        style: {marginRight: "15px"},
                                        on: {
                                            click: () => {
                                                this.handleDelete(params.row.id);
                                            }
                                        }
                                    }, '删除'),
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
            getReviewList(key) {
                let str = sessionStorage.getItem('userInfo');
                str = JSON.parse(str);
                this.userId = str.Id;
                let data=this.pageData;
                data.informType=this.informType;
                data.keywordName=key;
                GetComment(data).then(res => {
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
                DealComment({handlerId: this.userId, informId: rowId}).then(res => {
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
                            DeleteComment({informId: data}).then(res => {
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
