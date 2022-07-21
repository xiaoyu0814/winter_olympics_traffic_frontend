<template>
  <div id="nav">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      @select="handleSelect"
      router
    >
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/watchingPerson">观赛人群种类辨识</el-menu-item>
      <el-menu-item index="/watchingTravel">观赛出行模式辨识</el-menu-item>
      <el-menu-item index="/trafficLevel">交通需求层次辨识</el-menu-item>
      <el-submenu index="2">
        <template slot="title">多场景瓶颈挖掘</template>
        <el-menu-item index="/flowScatter">赛区附近路网流量消散</el-menu-item>
        <el-menu-item index="/coupledTraffic">城市多模式耦合交通</el-menu-item>
        <el-menu-item index="/crossCityTransportation"
          >空铁长距离跨城交通</el-menu-item
        >
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "/",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key == "/") {
        this.$store.state.routerView = false;
      } else {
        this.$store.state.routerView = true;
      }
    },
  },
};
</script>

<style scoped>
#nav {
  height: 100%;
  background-color: #fff;
}
</style>