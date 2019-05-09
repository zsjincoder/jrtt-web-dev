<template>
    <div>
        <Row>
            <Col span="6">
                <Card>
                    <Row slot="title">
                        <Col style="text-align: center" span="8">
                            <Button type="primary" @click="addParam" v-if="btns['add-parameterManagement']" >新增</Button>
                        </Col>
                        <Col style="text-align: center" span="8">
                            <Button type="success" @click="modifyParam" v-if="btns['edit-parameterMangament']" >修改</Button>
                        </Col>
                        <Col style="text-align: center" span="8">
                            <Button type="error" @click="deleteParam" v-if="btns['delete-parameterManagement']">删除</Button>
                        </Col>
                    </Row>
                    <Tree :data="param" @on-select-change="selectItem"></Tree>
                </Card>
            </Col>
            <Col span="16" :offset="1">
                <Card>
                    <p slot="title">{{cardData.ParamName}}</p>
                    <Row>
                        <Col span="12">
                            <p>参数编码：<span>{{cardData.ParamCode}}</span></p>
                        </Col>
                        <Col span="12">
                            <p>参数序号：<span>{{cardData.Order}}</span></p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <p>参数描述：{{cardData.ParamDescribe}}</p>
                        </Col>

                    </Row>
                </Card>
            </Col>
        </Row>
        <add-modify-param v-if="isFlag" :parentCode="parentItemId" :rowId="paramItemId" :isClose="isFlag" :isConfig="isConfig" @closeUpdate="closeUpdate" @close="_close"></add-modify-param>
    </div>
</template>

<script>
    import  {GetParamList,AddOrModifyParam,DeleteParam} from '@/api/paramManageApi.js'
    import addModifyParam from './add-modify-param.vue'
    import {judgeButtonRole} from '@/libs/util.js'
    export default {
        name: "menuManagement",
        components:{addModifyParam},
        data() {
            return {
                param: [],
                param1:[],
                key:"",
                cardData: {},
                paramItemId: "",
                parentItemId:"",
                isFlag:false,
                isConfig:false,//控制是修改还是新增
                btns:{
                    "delete-parameterManagement":false,
                    "add-parameterManagement":false,
                    "edit-parameterMangament":false
                }
            }
        },
        methods: {
            getParamList() {
                GetParamList().then(res => {
                    if (res.data.code == 0) {
                        this.param1=res.data.data;
                        this.param=this.treeData();
                        if(this.param.length>0){
                            this.selectItem([]);
                        }
                    }
                })
            },
            treeData(){
                let testData=[];
                console.log(this.param1);
                for (let i=0;i<this.param1.length;i++) {
                    testData.push({
                        title:this.param1[i].ParamName,
                        Id:this.param1[i].Id,
                        ParentId:this.param1[i].ParentId,
                        ParamCode:this.param1[i].ParamCode
                    })
                }
                console.log(testData);
                let cloneData = testData;// 对源数据深度克隆
                let tree = cloneData.filter(father=>{              //循环所有项
                    let branchArr = cloneData.filter(child=>{
                        return father.Id == child.ParentId      //返回每一项的子级数组
                    });
                    if(branchArr.length>0){
                        father.children = branchArr;    //如果存在子级，则给父级添加一个children属性，并赋值
                    }
                    return father.ParentId=="/";      //返回第一层
                });
                console.log(tree);
                return tree     //返回树形数据
            },
            selectItem(item){
                if(item.length>0){
                    this.paramItemId=item[0].Id;
                    this.parentItemId=item[0].ParamCode;
                }
                if(this.param.length>0){
                    GetParamList({paramId: this.paramItemId}).then(res =>{
                        if(res.data.code==0){
                            this.cardData=res.data.data;
                        }
                    })
                }
            },//选中项设置
            addParam(){
                    this.isConfig=false;
                    this.isFlag=true;

            },//单击新增按钮
            modifyParam(){
                if(this.paramItemId!=""){
                    this.isFlag=true;
                    this.isConfig=true;
                }else {
                    this.$Message.warning("请先选中要修改的参数项");
                }
            },//修改
            deleteParam(){
                this.$confirm('确认删除吗？', '警告', {
                    type: 'warning',
                    callback: (ac, ins) => {
                        if (ac == 'confirm') {
                            DeleteParam({paramId:this.paramItemId}).then(res => {
                                if (res.data.code == 0) {
                                    this.$Message.success("删除成功");
                                    this.getParamList();
                                } else {
                                    this.$Message.error("删除失败");
                                }
                            })
                        }
                    }
                })
            },//删除
            closeUpdate(){
                this.isFlag=false;
                this.getParamList();
            },//关闭并更新
            _close(){
                this.isFlag=false;
            }
        },
        created() {
            this.getParamList();
            this.btns=judgeButtonRole(this.btns,this.$route.path);
            console.log(this.btns);
        }
    }
</script>

<style scoped>

</style>
