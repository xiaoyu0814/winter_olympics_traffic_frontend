<template>
  <div id="crossCityTransportation">
    <mapBox />
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
      let path = this.$path.excavate.airport_demand;
      let params = {};
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          //   this.removeMapLayer();
          for (let i = 0; i < res.result.data.length; i++) {
            let temp = {
              path: `${res.result.data[i].start_location};${res.result.data[i].end_location}`,
              label: `起点：${res.result.data[i].start_name}，终点：${res.result.data[i].end_name}`,
            };
            // this.$map.pathSimplifier(temp,"noAnimate");
            this.$map.addLinelayer(temp.path);
          }
        }
      });
    },
  },
};
</script>

<style scoped>
#crossCityTransportation {
}
</style>