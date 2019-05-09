<template>
    <div>
        <Modal
            v-model="isClose"
            :closable="false"
            :mask-closable="false"
            width="600">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon style="margin-right: 5px"></Icon>
                <span>{{title}}</span>
            </p>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
                <FormItem label="参数编码" prop="ParamCode" >
                    <Input v-model="formData.ParamCode" :disabled="isDisable" placeholder="请输入参数编码"></Input>
                </FormItem>
                <FormItem label="参数名称" prop="ParamName">
                    <Input v-model="formData.ParamName" placeholder="请输入参数名称"></Input>
                </FormItem>

                <FormItem label="菜单序号" prop="Order">
                    <InputNumber v-model="formData.Order" placeholder="请输入参数序号"></InputNumber>
                </FormItem>
                <FormItem   label="父级参数" >
                    <Select v-model="formData.ParentId" @on-change="detection">
                        <Option v-for="item in parentList" :value="item.id" :key="item.id">{{ item.paramName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="参数描述">
                    <Input v-model="formData.ParamDescribe" placeholder="请输入参数描述"></Input>
                </FormItem>
            </Form>
            <!-- 自定义modal的底部 -->
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close()">关闭</Button>
                <Button type="primary" @click="_saveBtn('formData')" :loading="loading">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {addOrModifyMenu,getParentList,GetMenuList} from '@/api/menuManageApi.js'
    import {QueryParamSelect,AddOrModifyParam,GetParamList} from '@/api/paramManageApi.js'
    export default {
        props: {rowId: String, isClose: Boolean,isConfig:Boolean,parentCode:String},
        name: "add-modify-menu",
        data() {
            return {
                loading: false,
                title:"新增",
                isDisable:true,//是否禁用
                parentList:[{
                    id:'/',
                    paramName:'父级菜单'
                }],//父级菜单项数据
                formData: {
                    ParamCode:'',
                    ParamName:'',
                    Order:1,
                    ParentId:'',
                    ParamDescribe:'',
                    Id:''
                },
                ruleValidate: {
                    ParamCode: [{required: true, type: "string", message: "请输入参数编码", trigger: 'blur'}],
                    ParamName:[{required: true, type: "string", message: "请输入参数名称", trigger: 'blur'}],
                    Order:[{required: true, type: "number", message: "请输入参数序号", trigger: 'blur'}],
                }
            }
        },
        created(){
            this.openModel();
            this.getPrentData();
        },
        methods: {
            getUser(data) {
                GetParamList(data).then(res=>{
                    if(res.data.code==0){
                        this.formData=res.data.data
                    }
                });
            },//得到要修改用户的信息
            getPrentData(){
                QueryParamSelect().then(res=>{
                    if(res.data.code==0){
                        for (let i=0;i<res.data.data.length;i++){
                            this.parentList.push(res.data.data[i]);
                        }

                    }
                });
            },
            detection(data){
                console.log(data);
                if(data=="/"){
                    this.formData.ParamCode="";
                    this.isDisable=false;
                }else {
                    this.isDisable=true;
                }
            },
            _close() {
                this.$emit('close')
            },//关闭弹窗
            _saveBtn(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.formData.Order= parseInt(this.formData.Order);
                        AddOrModifyParam(this.formData).then(res => {
                            this.loading = false;
                            if (res.data.code == 0) {
                                this.$Message.success("保存成功");
                                this.$emit('closeUpdate');//
                            } else {
                                if(!res.data.hasNo)
                                this.$Message.error("保存失败");
                            }
                        })
                    }
                });

            },//保存后关闭弹窗并更新数据
            openModel(){
                if(this.isConfig){
                    this.title="修改";
                    this.getUser({paramId:this.rowId});
                }
                if(this.rowId!=""){
                    this.formData.ParentId=this.rowId;
                }
                if(this.parentCode!=""){
                    this.formData.ParamCode=this.parentCode;
                }
            }
        }

    }
</script>

<style scoped>

</style>
