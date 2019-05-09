<template>
    <div>
        <Modal
            v-model="isClose"
            :closable="false"
            :mask-closable="false"
            width="600">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon  style="margin-right: 5px"></Icon>
                <span>编辑</span>
            </p>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="用户名" prop="UserName">
                            <Input v-model="formData.UserName"  placeholder="请输入用户名"></Input>
                        </FormItem>
                   </Col>
                    <Col span="12">
                        <FormItem label="性别" >
                            <RadioGroup v-model="formData.Sex">
                                <Radio label="1"><span>男</span></Radio>
                                <Radio label="0"><span>女</span></Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col></Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="籍贯">
                            <Input v-model="formData.Area" placeholder="请输入籍贯"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="手机号" prop="Mobile">
                            <Input v-model="formData.Mobile" placeholder="请输入手机号码"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="出生日期" prop="Brithday" >
                            <DatePicker size="large" type="date"  format="yyyy-MM-dd" @on-change="getDate" v-model="formData.Brithday" placeholder="选择日期"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="个人简介" >
                            <Input type="textarea" :rows="4" v-model="formData.UserIntroduction" placeholder="请输入个人简介"></Input>
                        </FormItem>
                    </Col>
                </Row>




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
    import  {GetUserList,ModifyUserInfo} from '@/api/userManageApi.js'
    import  {validatePhoneNum,validateBrithday} from '@/libs/Validation.js'
    import  {renderTime} from  '@/libs/util.js'
    export default {
        props:{rowId:String,isClose:Boolean},
        name: "modify-user-info",
        data(){
            return{
                loading:false,
                formData:{},
                newdate:"",//保存用户重新选择的日期字符串
                ruleValidate:{
                    UserName:[{required:true,type:"string",message:"请输入姓名",trigger: 'blur'}],
                    Mobile:[{required:true,type:"string",validator:validatePhoneNum,trigger: 'blur'}],
                    Brithday:[{type:"string",validator:validateBrithday,trigger: 'blur'}]
                }
            }
        },
        methods:{
            getUser(){
                GetUserList({userId:this.rowId}).then(res =>{
                   if(res.data.code==0){
                       this.formData=res.data.data.data[0];
                       this.newdate=this.formData.Brithday;
                       // this.newdate=renderTime(this.newdate);
                       console.log(this.newdate);
                   }
                })
            },//得到要修改用户的信息
            _close(){
                this.$emit('close')
            },//关闭弹窗
            _saveBtn(name){
                this.$refs[name].validate(valid =>{
                   if(valid){
                       this.loading=true;
                       this.formData.Brithday=this.newdate;
                       let Data = new FormData();
                       for(let key in this.formData ){
                           Data.append(key,this.formData[key]);
                       }
                       ModifyUserInfo(Data).then(res =>{
                           this.loading=false;
                           if(res.data.code==0){
                               this.$Message.success("保存成功");
                               this.$emit('closeUpdate');//
                           }else {
                               this.$Message.error("保存失败");
                           }
                       })
                   }
                });

            },//保存后关闭弹窗并更新数据
            getDate(value){
                this.newdate=value;

            }//设置日期格式为yyy-MM-dd
        },
        created(){
            this.getUser();
        }
    }
</script>

<style scoped>

</style>
