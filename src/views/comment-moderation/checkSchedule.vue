<template>
    <div>
        <Modal
            v-model="isConfig"
            :closable="false"
            :mask-closable="false"
            width="900">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon style="margin-right: 5px"></Icon>
                <span>{{title}}</span>
            </p>
            <div>
                <Steps :current="reCheckInfo.status">
                    <Step v-if="reCheckInfo.status==0" title="未处理" :content="reCheckInfo.processingState"></Step>
                    <Step v-else title="确认处理" :content="reCheckInfo.processingState"></Step>
                    <Step v-if="reCheckInfo.status==1||reCheckInfo.status==0" title="处理中" :content="reCheckInfo.content"></Step>
                    <Step v-else-if="reCheckInfo.status==2"  title="已处理" :content="reCheckInfo.results"></Step>
                    <Step  title="处理完成" :content="reCheckInfo.results"></Step>
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
        name: "checkSchedule",
        props:{isConfig:Boolean,checkInfo:Object},
        data(){
            return{
                title:"查看处理进度",
                reCheckInfo:{},
            }
        },
        created(){
          this.getCheckInfo();
        },
        methods:{
            getCheckInfo(){
                this.reCheckInfo=this.checkInfo;
                this.reCheckInfo.status=parseInt(this.checkInfo.status);
                this.reCheckInfo.handlerTime=renderTime(this.reCheckInfo.handlerTime);
                if( this.reCheckInfo.status==0){
                    this.reCheckInfo.processingState="未处理";
                    this.reCheckInfo.content="处理人：无"+" "+"处理时间：无";
                    this.reCheckInfo.results="处理结果：无"
                }else if(this.reCheckInfo.status==1){
                    this.reCheckInfo.processingState="处理中";
                    this.reCheckInfo.content="处理人："+this.checkInfo.handlerName+" "+"处理时间："+this.reCheckInfo.handlerTime;
                    this.reCheckInfo.results="处理结果：无"
                }else {
                    this.reCheckInfo.processingState="已处理";
                    this.reCheckInfo.content="处理人："+this.checkInfo.handlerName+" "+"处理时间："+this.reCheckInfo.handlerTime;
                    if(this.reCheckInfo.isVerified==1){
                        this.reCheckInfo.results="处理结果：属实，"+"  "+"举报原因："+this.reCheckInfo.informTitle;
                    }else {
                        this.reCheckInfo.results="处理结果：不属实";
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
