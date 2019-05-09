<template>
    <div>
        <div class="container">
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="24">
                        <FormItem label="文章主题：">
                            <Input v-model="formData.Title" placeholder="请输入文章主题"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6">
                        <FormItem label="分类：" prop="ClassifyId">
                            <Select v-model="formData.ClassifyId" >
                                <Option v-for="item in parentList1" :value="item.Id" :key="item.Id">{{ item.ParamName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="频道：" prop="ChannelId">
                            <Select v-model="formData.ChannelId"  >
                                <Option v-for="item in parentList2" :value="item.Id" :key="item.Id">{{ item.ParamName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="是否发布">
                            <Checkbox v-model="isSelect"></Checkbox>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <quill-editor ref="myTextEditor" v-model="formData.Content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit('formData')">提交</el-button>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import {AddOrModifyMarkDown,GetClassifyAndChannel,GetArticle} from '@/api/editarticlesManageApi.js'
    export default {
        data: function(){
            return {
                rowId:"",
                formData:{
                    Content:"",
                    Title:"",
                    ClassifyId:"",
                    ChannelId:"",
                    UserId:"",
                    PublishedType:""
                },
                ruleValidate:{
                    ClassifyId:[{required:true,type:"string",message:"请先选择分类",trigger:"blur"}],
                    ChannelId:[{required:true,type:"string",message:"请先选择频道",trigger:"blur"}]
                },
                isSelect:false,
                parentList1:[],//分类id
                parentList2:[],//频道id
                editorOption: {
                    placeholder: '编辑文章'
                }
            }
        },
        components: {quillEditor},//组件注册
        created(){
          this.getClassify();
          this.getChannel();
          this.getArticle();
        },
        methods: {
            getArticle(){
                let rowData=this.$route.query;
                GetArticle({articleId:rowData.rowId}).then(res=>{
                    if(res.data.code==0){
                        console.log(res.data.data);
                    }
                })
            },
            getClassify(){
                GetClassifyAndChannel({paramCode:"ArticleClassification"}).then(res=>{
                    if(res.data.code==0){
                        this.parentList1=res.data.data
                    }
                })
            },//获取分类下拉列表
            getChannel(){
                GetClassifyAndChannel({paramCode:"ArticleChannel"}).then(res=>{
                    if(res.data.code==0){
                        this.parentList2=res.data.data
                    }
                })
            },//获取频道下拉列表
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            submit(name){
                this.$refs[name].validate(valid =>{
                    if(valid){
                        let userInfo=sessionStorage.getItem('userInfo');
                        userInfo=JSON.parse(userInfo);
                        this.formData.UserId=userInfo.Id;
                        if(this.isSelect){
                            this.formData.PublishedType="1";
                        }else {
                            this.formData.PublishedType="0";
                        }
                        console.log(this.formData);
                        AddOrModifyMarkDown(this.formData).then(res=>{
                            if(res.data.code==0){
                                this.$message.success('提交成功！');
                                this.formData={};
                                this.isSelect=false;
                                this.$router.push("/articleManagement");
                            }
                        })
                    }
                })


            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>
