<template>
    <div>
        <Modal
            v-model="isConfig3"
            :closable="false"
            :mask-closable="false"
            width="900">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon style="margin-right: 5px"></Icon>
                <span>{{title}}</span>
            </p>
            <div>
                <Steps :current="complaintInfo.status"  direction="vertical">
                    <Step   title="确认申诉"   :content="complaintInfo.processingState"></Step>
                    <Step  v-if="complaintInfo.status==0||complaintInfo.status==1" title="文章申诉中"  :content="complaintInfo.content"></Step>
                    <Step  v-else title="文章申诉"  content="处理完成"></Step>
                    <Step  v-if="complaintInfo.status==0||complaintInfo.status==1" title="申诉结果"  content="无" ></Step>
                    <Step  v-else  title="申诉结果"  :content="this.complaintInfo.results" ></Step>
                </Steps>
            </div>
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close()">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import  {GetAppealInfo} from  '@/api/articleManageApi.js'
    export default {
        name: "appealProcess",
        props:{isConfig3:Boolean,articleInfo:Object},
        data(){
            return{
                complaintArticleInfo:{},
                title:"文章申诉流程进度",
                complaintInfo:{}
            }
        },
        created(){
          this.loadInfo();
        },
        methods:{
            loadInfo(){
                this.complaintArticleInfo=this.articleInfo;
                this.complaintArticleInfo.status=parseInt( this.complaintArticleInfo.status);
                GetAppealInfo({articleId:this.complaintArticleInfo.id}).then(res =>{
                    if(res.data.code==0){
                        this.complaintInfo=res.data.data[0];
                        this.complaintInfo.status=parseInt( this.complaintInfo.status);
                        console.log(this.complaintInfo);
                        if(this.complaintInfo.status==0){
                            this.complaintInfo.processingState="申诉人："+this.complaintInfo.appealUserName+" "+"申诉时间："+this.complaintInfo.createTime;
                            this.complaintInfo.content="申诉人："+this.complaintInfo.appealUserName+" "+"申诉时间："+this.complaintInfo.createTime;
                            this.complaintInfo.results="申诉结果：无"
                        } else if(this.complaintInfo.status==1){
                            this.complaintInfo.processingState="申述中";
                            this.complaintInfo.content="申诉人："+this.complaintInfo.appealUserName+" "+"申诉时间："+this.complaintInfo.createTime;
                            this.complaintInfo.results="处理结果：无"
                        } else  if(this.complaintInfo.status==2){
                            this.complaintInfo.processingState="已处理";
                            this.complaintInfo.content="申诉人："+this.complaintInfo.handlerName+" "+"申诉人："+this.complaintInfo.handlerTime;
                            if(this.complaintInfo.isPass=="1"){
                                this.complaintInfo.results="申诉结果：通过";
                            }else {
                                this.complaintInfo.results="申诉结果：不通过";
                            }

                        }
                    }
                })

            },
            _close(){
              this.$emit("close");
            }
        }
    }
</script>

<style scoped>

</style>
