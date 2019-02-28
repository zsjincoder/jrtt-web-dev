<template lang="html">
  <div class="loading-wrapper">
    <div class="demo-spin-col" span="8">
      <Spin fix>
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>加载中</div>
      </Spin>
    </div>
  </div>
</template>
<script>
export default{
  
}
</script>

<style>
.loading-wrapper .demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
.loading-wrapper .ivu-spin-fix{
  z-index: 999;
}
</style>