<template>
  <div id="homePage">
    <selfNav class="nav" v-show="nav_show" />
    <el-button class="btn" @click="nav_show = !nav_show">导航</el-button>
    <!-- <div>{{ $store.state.test }}</div> -->
    <div v-if="!$store.state.routerView">
      <mapBox class="mapBox" />
      <rightList class="rightList" />
      <regionalQuery class="dialog" v-if="$store.state.regionalQuery_show" />
      <personnelFlow class="dialog" v-if="$store.state.personnelFlow_show" />
      <travelStatistics
        class="dialog"
        v-if="$store.state.travelStatistics_show"
      />
      <traffic class="dialog" v-if="$store.state.traffic_show" />
      <level class="dialog" v-if="$store.state.level_show" />
      <excavate class="dialog" v-if="$store.state.excavate_show" />
      <drawer />
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import selfNav from "@/components/model/nav";
import mapBox from "@/components/map";
import rightList from "@/components/rightList";
import regionalQuery from "@/components/regionalQuery";
import personnelFlow from "@/components/personnelFlow";
import travelStatistics from "@/components/travelStatistics";
import traffic from "@/components/traffic";
import level from "@/components/level";
import excavate from "@/components/excavate";
import drawer from "@/components/drawer/drawer";
export default {
  name: "homePage",
  components: {
    selfNav,
    mapBox,
    rightList,
    regionalQuery,
    personnelFlow,
    travelStatistics,
    traffic,
    drawer,
    level,
    excavate,
  },
  data() {
    return {
      nav_show: true,
    };
  },
  mounted() {
    this.test();
  },
  methods: {
    test() {
      let path = "https://oneticket.jphtw.top/point-by-name-array";
      let params = {};
      this.$http.get(path, params).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#homePage {
  height: 100vh;
  width: 100%;
}
.mapBox {
  width: 100%;
  height: 100vh;
}
.rightList {
  position: fixed;
  right: 10px;
  top: 300px;
  z-index: 2;
}
.dialog {
  position: fixed;
  top: 300px;
  left: 50%;
  margin-left: -200px;
}

.nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
}
.btn {
  position: fixed;
  right: 100px;
  top: 100px;
  z-index: 10;
}
</style>
