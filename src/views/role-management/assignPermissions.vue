<template>
    <div>
        <Modal
            v-model="isClose1"
            :closable="false"
            :mask-closable="false"
            width="900">
            <!-- 自定义modal的头部 -->
            <p slot="header" style="color:#2d8cf0;">
                <Icon style="margin-right: 5px"></Icon>
                <span>分配权限</span>
            </p>
            <el-table
                :data="data1"
                stripe
                border
                style="width: 100%">
                <el-table-column

                    label="主菜单"
                    width="180">
                    <el-checkbox-group v-model="testData">
                        <template slot-scope="scope">
                            <el-checkbox :label="  scope.row.Id">{{scope.row.MenuTitle}}</el-checkbox>
                        </template>
                    </el-checkbox-group>
                </el-table-column>
                <el-table-column
                    label="子菜单"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="按钮权限">
                </el-table-column>
            </el-table>

            <Table :columns="columns1" :data="data1" border></Table>
            <CheckboxGroup @on-change="checkAllGroupChange">
                <Checkbox label="香蕉"></Checkbox>
                <Checkbox label="苹果"></Checkbox>
                <Checkbox label="西瓜"></Checkbox>
            </CheckboxGroup>
            <!-- 自定义modal的底部 -->
            <div slot="footer">
                <Button style="margin-left: 8px" @click="_close()">关闭</Button>
                <Button type="primary" @click="_saveBtn('formData')" :loading="loading">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {GetMenuList} from '@/api/menuManageApi.js'
    import {getAllButton} from '@/api/buttonManageApi.js'

    export default {
        props: {rowId: String, isClose1: Boolean},
        name: "assignPermissions",
        data() {
            return {
                loading: false,
                title: "新增",
                parentList: [],
                buttonList: [],
                testData: [],
                testText: "121",
                parentMenuId: {},
                columns1: [
                    {
                        title: '主菜单权限', width: 150,
                        render: (h, params) => {
                            return h('div', {
                                // on:{
                                //     click:()=>{
                                //         this.getRowId();
                                //     }
                                // }
                            }, [
                                h('CheckboxGroup', {
                                    props: {
                                        // value:this.data2,
                                    },
                                    on: {
                                        "on-change": (item) => {
                                            if (item.length > 0) {
                                                let data = {
                                                    id: item[0],
                                                    menuName: params.row.MenuTitle,
                                                    childMenuList: []
                                                }
                                                this.data2[params.index] = data
                                            } else {
                                                this.data2.splice(params.index, 1);
                                            }
                                        }
                                    }
                                }, [
                                    h('Checkbox', {
                                        props: {label: params.row.Id}
                                    }, params.row.MenuTitle)
                                ])
                            ])
                        }
                    },
                    {
                        title: '子菜单权限', width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('CheckboxGroup', {
                                    // props: {value: this.data2}
                                    on: {
                                        "on-change": (item1) => {

                                            console.log(item1)
                                        }
                                    }
                                }, [
                                    params.row.childmenulist.map(function (item, index) {
                                        return h('div', {
                                            class: 'childNode',
                                        }, [
                                            h('Checkbox', {
                                                props: {label: item.Id, index: index},
                                            }, item.MenuTitle)
                                        ])


                                    })

                                ])
                            ])

                        }
                    },
                    {
                        title: '按钮权限',
                        render: (h, params) => {
                            return h('div', [
                                // params.row.childmenulist.map(function (item) {
                                //     return h("div", {class: 'childNode'}, [
                                //         h("CheckboxGroup", {
                                //             props:{
                                //                 value:self.testData
                                //             },
                                //             on:{
                                //                 "on-change":(item1)=>{
                                //                     console.log(item1)
                                //                     console.log(self.testData)
                                //                 }
                                //             }
                                //         }, [
                                //             item.button.map(function (button) {
                                //                 return h('Checkbox', {
                                //                     props: {label: button.buttonName}
                                //                 })
                                //             })
                                //         ])
                                //     ])
                                // })
                                h("checkbox-group", {
                                    props: {
                                        vModel: this.testData
                                    },
                                    on: {
                                        "on-change": (val) => {
                                            console.log(this.testData)
                                        }
                                    }
                                }, [
                                    h("checkbox", {
                                        props: {label: 123}
                                    }),
                                    h("checkbox", {
                                        props: {label: 321}
                                    }),
                                    h("Input", {
                                        props: {
                                            value: this.testText
                                        }
                                    })
                                ])
                            ])
                        }
                    }
                ],//表头
                data2: [],
                data1: [],//表格数据

            }
        },
        created() {
            this.getParentMenuLsit();
        },
        methods: {
            checkAllGroupChange(item) {
                console.log(item)
            },
            getParentMenuLsit() {
                GetMenuList().then(res => {
                    if (res.data.code == 0) {
                        this.parentList = res.data.data;
                        getAllButton().then(res => {
                            if (res.data.code == 0) {
                                this.buttonList = res.data.data;
                                this.ParentNode();
                            }
                        })
                    }
                });

            },
            ParentNode() {
                let dataList = [];
                for (let i = 0; i < this.parentList.length; i++) {
                    let key = {};
                    if (this.parentList[i].ParentId == '/') {
                        key.Id = this.parentList[i].Id;
                        key.MenuTitle = this.parentList[i].MenuTitle;
                        dataList = this.childNode(this.parentList[i].Id);
                        if (dataList.length > 0) {
                            key.childmenulist = dataList;
                        }
                        ;
                        this.data1.push(key)
                    }
                }
            },
            childNode(parentId) {
                let childmenulist = [];
                let dataList = [];
                for (let i = 0; i < this.parentList.length; i++) {
                    let key = {};
                    if (this.parentList[i].ParentId == parentId) {
                        key.Id = this.parentList[i].Id;
                        key.MenuTitle = this.parentList[i].MenuTitle;
                        dataList = this.buttonNode(this.parentList[i].Id);
                        if (dataList.length > 0) {
                            key.button = dataList
                        }
                        childmenulist.push(key)
                    }
                }
                return childmenulist
            },
            buttonNode(childMenuId) {
                let buttonList = [];
                for (let i = 0; i < this.buttonList.length; i++) {
                    let key = {};
                    if (this.buttonList[i].menu_id == childMenuId) {
                        key.buttonName = this.buttonList[i].button_name;
                        key.buttonId = this.buttonList[i].menu_id;
                        buttonList.push(key)
                    }

                }
                return buttonList
            },
            getRowId() {
                console.log(this.data2);
            }
        }

    }
</script>

<style>
    .childNode {
        width: 100%;
        height: 35px;
        border: 1px #d8dadf solid;
        padding: 2px;
        text-align: left;
        line-height: 30px;
    }
</style>
