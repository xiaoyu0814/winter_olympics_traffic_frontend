<template>
  <div id="coupledTraffic">
    <mapBox />
    <div class="legend_box">
      <span>路网流量</span>
      <img src="/assets/img/legend_2.png" alt="" />
    </div>
  </div>
</template>

<script>
import mapBox from "@/components/map";
export default {
  components: {
    mapBox,
  },
  data() {
    return {};
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let path = this.$path.excavate.hsr_demand;
      let params = {};
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
        //   this.removeMapLayer();
          let datas = [];
          for (let i = 0; i < res.result.data.length; i++) {
            let poine = res.result.data[i].location.split(",");
            let temp = {
              lng: poine[0],
              lat: poine[1],
              count: res.result.data[i].level,
            };
            datas.push(temp);
          }
          this.$map.addHeatmap(datas);
        }
      });
    },
  },
};
</script>

<style scoped>
#coupledTraffic {
}
.legend_box {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 2px 10px;
  background-color: #fff;
}
.legend_box span {
  font-size: 16px;
  margin-right: 20px;
}
.legend_box img {
  width: 200px;
}
</style>