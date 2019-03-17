<template>
    <div>
        <Row>
            <Col span="6">
                <Card>
                    <Row slot="title">
                        <Col style="text-align: center" span="8">
                            <Button type="primary" @click="addMenu" v-if="btns['add-menuManagement']">新增</Button>
                        </Col>
                        <Col style="text-align: center" span="8">
                            <Button type="success" @click="modifyMenu" v-if="btns['edit-menuMangament']">修改</Button>
                        </Col>
                        <Col style="text-align: center" span="8">
                            <Button type="error" @click="deleteMenu" v-if="btns['delete-menuManagement']">删除</Button>
                        </Col>
                    </Row>
                    <Tree :data="menu" @on-select-change="selectItem"></Tree>
                </Card>
            </Col>
            <Col span="16" :offset="1">
                <Card>
                    <p slot="title">{{cardData.MenuTitle}}</p>
                    <Row>
                        <Col span="12">
                            <p>菜单编码：<span>{{cardData.MenuCode}}</span></p>
                        </Col>
                        <Col span="12">
                            <p>菜单序号：<span>{{cardData.Order}}</span></p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <p>菜单图标：<i :class="cardData.MenuIcon"></i></p>
                        </Col>
                        <Col span="12">
                            <p>菜单路由：<span>{{cardData.RoutePath}}</span></p>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <add-modify-menu v-if="isFlag" :rowId="menuItemId" :isClose="isFlag" :isConfig="isConfig" @closeUpdate="closeUpdate" @close="_close"></add-modify-menu>
    </div>
</template>

<script>
    import {GetMenuList,deletMenu} from '@/api/menuManageApi.js'
    import addModifyMenu from './add-modify-menu.vue'
    import {judgeButtonRole} from '@/libs/util.js'
    export default {
        name: "menuManagement",
        components:{addModifyMenu},
        data() {
            return {
                menu: [],
                cardData: {},
                menuItemId: "",
                isFlag:false,
                isConfig:false,
                btns:{
                    "delete-menuManagement":false,
                    "add-menuManagement":false,
                    "edit-menuMangament":false
                }
            }
        },
        methods: {
            getMenuList() {
                GetMenuList().then(res => {
                    if (res.data.code == 0) {
                        this.processData1(res.data.data);
                        if (this.menu.length > 0) {
                            this.selectItem([]);//初始化就默认选中第一个菜单，并展示菜单信息
                        }
                    }
                })
            },
            processData1(data) {
                if (data[0]) {
                    this.menuItemId = data[0].Id;//初始化给menuItenId默认赋值为第一个菜单项Id
                }
                let k = [];//父对象包含父对象
                for (let i = 0; i < data.length; i++) {
                    let s = {};//父对象
                    if (data[i].ParentId == "/") {
                        s.title = data[i].MenuTitle;
                        s.expand = true;
                        s.Id = data[i].Id;
                        s.children = [];
                        if ((this.processData2(data[i].Id, data)).length != 0) {
                            s.children = this.processData2(data[i].Id, data);
                        }
                        k.push(s);
                    }
                }
                this.menu = k;
            },
            processData2(prentId, data) {
                let l = [];//儿子数组包含儿子对象
                for (let i = 0; i < data.length; i++) {
                    let p = {};//儿子对象
                    if (data[i].ParentId == prentId) {
                        p.title = data[i].MenuTitle;
                        p.expand = true;
                        p.Id = data[i].Id;
                        l.push(p);
                    }
                }
                return l;
            },//初始化处理数据
            selectItem(item) {
                if (item.length > 0) {
                    this.menuItemId = item[0].Id;
                }
                if (this.menu.length > 0) {
                    GetMenuList({menuId: this.menuItemId}).then(res => {
                        if (res.data.code == 0) {
                            this.cardData = res.data.data[0];
                        }
                    })
                }

            },//单击菜单项，重新加载菜单信息页
            addMenu() {
                this.isConfig=false;
                this.isFlag=true;
            },
            modifyMenu(){
                if(this.menuItemId!=""){
                    this.isFlag=true;
                    this.isConfig=true;
                }else {
                    this.$Message.warning("请先选中菜单！");
                }

            },
            deleteMenu(){
                this.$confirm('确认删除吗？', '警告', {
                    type: 'warning',
                    callback: (ac, ins) => {
                        if (ac == 'confirm') {
                            deletMenu(this.menuItemId).then(res => {
                                if (res.data.code == 0) {
                                    this.$Message.success("删除成功");
                                    this.getMenuList();
                                } else {
                                    this.$Message.error("删除失败");
                                }
                            })
                        }
                    }
                })
            },
            closeUpdate(){
                this.isFlag=false;
                this.getMenuList();
            },
            _close(){
                this.isFlag=false;
            }
        },
        created() {
            this.btns = judgeButtonRole(this.btns,this.$route.path)
            this.getMenuList();
        }
    }
</script>

<style scoped>

</style>
