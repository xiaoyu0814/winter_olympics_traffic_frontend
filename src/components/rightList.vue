<template>
  <div id="rightList">
    <div v-for="(item, index) in menuList" :key="index">
      <el-button type="primary" @click="openDialog(item)">{{
        item.label
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [
        // {
        //   label: "会场查询",
        // },
        {
          label: "出行统计",
        },
        {
          label: "人员流量",
        },
        {
          label: "地区查询",
        },
        {
          label: "交通预测",
        },
        {
          label: "交通层次",
        },
        {
          label: "场景挖掘",
        },
        {
          label: "北京地铁",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    openDialog(item) {
      if (item.label == "出行统计") {
        this.$store.state.travelStatistics_show = true;
      } else if (item.label == "人员流量") {
        this.$store.state.personnelFlow_show = true;
      } else if (item.label == "地区查询") {
        this.$store.state.regionalQuery_show = true;
      } else if (item.label == "交通预测") {
        this.$store.state.traffic_show = true;
        this.$map.trafficLayer.show();
      } else if (item.label == "交通层次") {
        this.$store.state.level_show = true;
      } else if (item.label == "场景挖掘") {
        this.$store.state.excavate_show = true;
      } else if (item.label == "北京地铁") {
        this.$store.state.mysubway_show = !this.$store.state.mysubway_show;
      }
    },
  },
};
</script>

<style scoped>
#rightList {
  display: flex;
  flex-direction: column;
}
#rightList > div {
  margin: 10px;
}
</style>