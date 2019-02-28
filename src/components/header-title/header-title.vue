<template lang="html">
  <header class="menu-header">
    <!-- 资源名称 -->
    <p class="search-name">{{searchName}}：</p>
    <div class="search-text">
      <Input type="text" :placeholder="placeholderText" v-model="pSearchResName"></Input>
    </div>
    <p class="serach-up-name">{{serachUpName}}：</p>
    <div class="serach-up-text">
      <Select v-model="model12" filterable clearable placeholder="请选择" @on-change="changValue">
        <Option v-for="item in listData" :value="`${item[keyName]}`" :key="`${item[keyId]}`">{{ item[keyName] }}</Option>
      </Select>
    </div>
    <div class="search-btn">
      <Button type="primary" @click="search">
        <Icon type="search"></Icon>
        查询
      </Button>
    </div>
    <div class="add-btn">
      <Button type="success" @click="modal">
        <Icon type="plus-round"></Icon>
        新增
      </Button>
    </div>
  </header>
</template>
<script>
export default{
  props: ['searchName','placeholderText','serachUpName','listData','keyName','keyId'],
  data() {
    return {
      model12: '',
      pSearchResName: ''
    }
  },
  watch: {
    pSearchResName(val) {
      this.$emit('getSearchResName',val);
    }
  },
  methods: {
    // 点击搜索按钮时触发的事件
    search(){
      this.$emit('search', this.firstPage);
    },
    // 点击新增按钮时显示modal层
    modal() {
      this.$emit('modal');
    },
    // 选择下拉框数据时触发的事件
    changValue(){
      this.model12 = this.model12? this.model12 : null;
      this.$emit('changValue',this.model12);
    }
  }
}
</script>

<style scoped lang="less">
@import '../../assets/css/index.less';

.menu-header{
  padding: 20px;
  /* height: 82px; */
  line-height: 30px;
  border: @base-border;
  display: flex;
  .search-name,
  .serach-up-name{
    font-weight: @normal-bold-font;
  }
  .search-text{
    margin-right: 20px;
    input{
      padding-left: 10px;
    }
  }
  .search-btn{
    flex: 1;
    text-align: right;
  }
  .add-btn{
    margin: @add-btn-margin;
  }
}
</style>