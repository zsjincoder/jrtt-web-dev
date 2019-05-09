<template>
    <div>
        <Modal
            v-model="isConfig2"
            :closable="false"
            :mask-closable="false"
            width="1200">
            <Card>
                <p slot="title">举报信息</p>
                <p>举报文章：{{reportingInformation.articleTitle}}</p>
                <p>举报类型：{{reportingInformation.informTitle}}</p>
                <p>举报内容：{{reportingInformation.informContent}}</p>
                <p>贴图：<img :src="reportingInformation.accessory"/></p>
            </Card>
            <Card style="margin-top: 10px">
                <p slot="title">申诉信息</p>
                <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
                    <Row>
                        <Col :span="24">
                            <FormItem label="申述内容：" prop="AppealContent">
                                <Input v-model="formData.AppealContent" placeholder="请输入申述内容" type="textarea" :rows="5"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <!-- 自定义modal的底部 -->
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close()">关闭</Button>
                <Button type="primary" @click="_saveBtn('formData')" :loading="loading">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {GetReportingInformation,AddComplaintInformation} from '@/api/articleManageApi.js'
    export default {
        name: "articleComplaint",
        props: {isConfig2: Boolean, paragraph: String},
        data() {
            return {
                reportingInformation: {},
                loading:false,
                AppealUserId:"",//当前用户Id
                formData:{
                    InformId:"",
                    AppealContent:"",
                    ArticleId:""
                },
                ruleValidate: {
                    AppealContent: [{required: true, type: "string", message: "请输入申诉信息", trigger: 'blur'}],
                }
            }
        },
        created() {
            this.getReportingInformation();
        },
        mounted(){
            this.getUserInfo();
        },
        methods: {
            getReportingInformation() {
                GetReportingInformation({articleId:this.paragraph}).then(res => {
                    if (res.data.code == 0) {
                        this.reportingInformation = res.data.data[0];
                        this.formData.InformId=res.data.data[0].id;
                    }
                })
            },
            getUserInfo(){
                let userInfo=sessionStorage.getItem('userInfo');
                userInfo=JSON.parse(userInfo);
                this.AppealUserId=userInfo.Id;
            },
            _close(){
                this.$emit("close");
            },
            _saveBtn(data){
                console.log(123);
                this.$refs[data].validate(valid =>{
                    if(valid){
                        this.loading=true;
                        this.formData.AppealUserId=this.AppealUserId;
                        this.formData.ArticleId=this.paragraph;
                        console.log(this.formData.AppealUserId);
                        AddComplaintInformation(this.formData).then(res =>{
                            if(res.data.code==0){
                                this.loading=false;
                                this.$Message.success("提交成功！");
                                this.$emit("closeUpdata");
                            }else{
                                this.$Message.error("提交失败！")
                            }
                        })
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>
