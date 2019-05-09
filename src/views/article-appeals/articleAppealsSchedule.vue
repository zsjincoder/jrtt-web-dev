<template>
    <div>
        <Modal
            v-model="reIsConfig"
            :closable="false"
            :mask-closable="false"
            width="1300">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon style="margin-right: 5px"></Icon>
                <span>{{title}}</span>
            </p>
            <div>
                <Steps :current="reCheckInfo.status">
                    <Step v-if="reCheckInfo.status==0" title="未处理" :content="reCheckInfo.processingState"></Step>
                    <Step v-else title="确认处理" :content="reCheckInfo.processingState"></Step>
                    <Step title="处理中" :content="reCheckInfo.content"></Step>
                    <Step title="处理完成" :content="reCheckInfo.results"></Step>
                </Steps>
            </div>
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close()">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {renderTime} from '@/libs/util.js'
    export default {
        name: "articleAppealsSchedule",
        props:{isConfig:Boolean,checkInfo:Object},
        data(){
            return{
                title:"查看处理进度",
                reCheckInfo:{},
                reIsConfig:false,
            }
        },
        watch:{
            isConfig(value,oldValue){
                this.reIsConfig=value;
                this.getCheckInfo();
            }
        },
        methods:{
            getCheckInfo(){
                this.reCheckInfo=this.checkInfo;
                this.reCheckInfo.status=parseInt(this.checkInfo.status);
                this.reCheckInfo.handlerTime=renderTime(this.reCheckInfo.handlerTime);
                if( this.reCheckInfo.status==0){
                    this.reCheckInfo.processingState="未审核";
                    this.reCheckInfo.content="审核人：无"+" "+"审核时间：无";
                    this.reCheckInfo.results="审核结果：无"
                }else if(this.reCheckInfo.status==1){
                    this.reCheckInfo.processingState="审核中";
                    this.reCheckInfo.content="审核人："+this.checkInfo.handlerAppealName+" "+"审核文章："+this.reCheckInfo.articleTitle+" "+"审核时间："+this.reCheckInfo.handlerTime+" ";
                    this.reCheckInfo.results="审核结果：无"
                }else {
                    this.reCheckInfo.processingState="已审核";
                    this.reCheckInfo.content="审核人："+this.checkInfo.handlerAppealName+" "+"审核时间："+this.reCheckInfo.handlerTime;
                    if(this.reCheckInfo.isPass==1){
                        this.reCheckInfo.results="审核结果：通过";
                    }else {
                        this.reCheckInfo.results="审核结果：不通过"+"  "+"举报原因："+this.reCheckInfo.informTitle;
                    }

                }
            },
            _close(){
                this.$emit("close")
            }

        }
    }
</script>

<style scoped>

</style>

