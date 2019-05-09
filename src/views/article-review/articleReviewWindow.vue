<template>
    <Modal
        v-model="reIsConfig"
        :closable="false"
        :mask-closable="false"
        width="800">
        <!-- 自定义modal的头部 -->
        <p slot="header" style="color:#2d8cf0;">
            <Icon style="margin-right: 5px"></Icon>
            <span>{{title}}</span>
        </p>
        <Row>
            <Col span="24">
                <Card v-model="articleReviewData">
                    <p slot="title">举报信息</p>
                    <p>被举报文章：{{articleReviewData.articleTitle}}</p>
                    <p>文章作者：{{articleReviewData.accusedName}}</p>
                    <p>举报用户：{{articleReviewData.informerName}}</p>
                    <p>举报时间：{{articleReviewData.createTime}}</p>
                    <p>举报类型：{{articleReviewData.informTitle}}</p>
                    <p>举报内容：{{articleReviewData.informContent}}</p>
                    <p>附件:</p><img :src="articleReviewData.accessory">
                </Card>
            </Col>
        </Row>
        <Row>
            <Col span="3">
                <p>是否属实：</p>
            </Col>
            <Col span="3">
                <i-switch v-model="switchData" @on-change="change"/>
            </Col>
            <Col span="18"></Col>
        </Row>
        <!-- 自定义modal的底部 -->
        <div slot="footer">
            <Button style="margin-left: 8px" @click="_close()">关闭</Button>
            <Button type="primary" @click="_saveBtn()" :loading="loading">保存</Button>
        </div>
    </Modal>
</template>

<script>
    import {GetOneComment,SaveComment} from '@/api/commentManageApi.js'
    import {renderTime} from '@/libs/util.js'
    export default {
        name: "articleReviewWindow",
        props: {isConfig: Boolean, commentId: String},
        data() {
            return {
                loading: false,
                title: "审核举报",
                articleReviewData: {},
                switchData:true,
                through:"1",
                reIsConfig:false,
            }
        },
        watch:{
            isConfig(value,oldvalue){
                if(value){
                    this.reIsConfig=value;
                    this.getOneComment();
                }else {
                    this.reIsConfig=value
                }
            }
        },
        methods: {
            getOneComment() {
                GetOneComment({informId: this.commentId}).then(res => {
                    if (res.data.code == 0) {
                        this.articleReviewData = res.data.data[0];
                        this.articleReviewData.createTime=renderTime(this.articleReviewData.createTime);
                    }
                })
            },
            change(staus) {
                console.log(staus);
                if(staus){
                    this.through=1
                }else {
                    this.through=0
                }
            },
            _saveBtn() {
                SaveComment({Id:this.commentId,Suggestion:"",isVerified:this.through,informType:"1"}).then(res=>{
                    if(res.data.code==0){
                        this.$emit("config");
                    }
                })
            },
            _close() {
                this.$emit("colseUpdata")
            }
        }
    }
</script>

<style scoped>

</style>

