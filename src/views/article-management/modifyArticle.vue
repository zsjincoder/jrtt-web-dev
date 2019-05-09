<template>
    <div>
        <Modal
            v-model="isClose"
            :closable="false"
            :mask-closable="false"
            width="1200">
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
                                <Select v-model="formData.ClassifyId">
                                    <Option v-for="item in parentList1" :value="item.Id" :key="item.Id">{{
                                        item.ParamName }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="频道：" prop="ChannelId">
                                <Select v-model="formData.ChannelId">
                                    <Option v-for="item in parentList2" :value="item.Id" :key="item.Id">{{
                                        item.ParamName }}
                                    </Option>
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
            <!-- 自定义modal的底部 -->
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close()">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import 'mavon-editor/dist/css/index.css';
    import {AddOrModifyMarkDown, GetClassifyAndChannel, GetArticle,SaveArticle} from '@/api/editarticlesManageApi.js'
    export default {
        components: {quillEditor},//组件注册
        props:{isClose:Boolean,rowId:String,userId:String},
        data: function () {
            return {
                formData: {
                    Content: "",
                    Title: "",
                    ClassifyId: "",
                    ChannelId: "",
                    UserId: "",
                    PublishedType: ""
                },
                ruleValidate: {
                    ClassifyId: [{required: true, type: "string", message: "请先选择分类", trigger: "blur"}],
                    ChannelId: [{required: true, type: "string", message: "请先选择频道", trigger: "blur"}]
                },
                isSelect: false,
                parentList1: [],//分类id
                parentList2: [],//频道id
                editorOption: {
                    placeholder: '编辑文章'
                }
            }
        },
        created() {
            this.getClassify();
            this.getChannel();
            this.getArticle();
        },
        methods: {
            getArticle() {
                GetArticle({articleId:this.rowId}).then(res => {
                    if (res.data.code == 0) {
                        console.log(res.data.data);
                        this.formData=res.data.data;
                        if(this.formData.PublishedType=="0"){
                            this.isSelect=false;
                        }else {
                            this.isSelect=true;
                        }//判断文章是否发布
                    }
                })
            },
            getClassify() {
                GetClassifyAndChannel({paramCode: "ArticleClassification"}).then(res => {
                    if (res.data.code == 0) {
                        this.parentList1 = res.data.data
                    }
                })
            },//获取分类下拉列表
            getChannel() {
                GetClassifyAndChannel({paramCode: "ArticleChannel"}).then(res => {
                    if (res.data.code == 0) {
                        this.parentList2 = res.data.data
                    }
                })
            },//获取频道下拉列表
            onEditorChange({editor, html, text}) {
                this.content = html;
            },
            submit(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        if (this.isSelect) {
                            this.formData.PublishedType = "1";
                        } else {
                            this.formData.PublishedType = "0";
                        }
                        SaveArticle(this.formData).then(res => {
                            if (res.data.code == 0) {
                                this.$message.success('提交成功！');
                                this._close();
                            }
                        })
                    }
                })


            },
            _close(){
                this.$emit('close');
            }
        }
    }
</script>
<style scoped>
    .editor-btn {
        margin-top: 20px;
    }
</style>
