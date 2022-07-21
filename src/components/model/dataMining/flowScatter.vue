<template>
  <div id="flowScatter">
    <mapBox />
    <ul class="header">
      <li
        class="item"
        v-for="(item, index) in cityList"
        :key="index"
        @click="getData(item, index)"
        :class="cityIndex == index ? 'select' : ''"
      >
        {{ item.label }}
      </li>
    </ul>
    <div class="legend_box">
      <span>路网流量</span>
      <img src="/assets/img/legend_2.png" alt="" />
    </div>
    <div class="jdt">
      <el-slider
        v-model="sliderValue"
        show-stops
        :min="min"
        :max="max"
        :marks="marks"
        disabled
      >
      </el-slider>
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
    return {
      timeValue: "",
      timeList: [],
      cityValue: "",
      cityList: [],
      cityIndex: -1,
      min: 0,
      max: 100,
      sliderValue: 0,
      marks: {},
      num: 0,
      interval_type: true,
    };
  },
  mounted() {
    this.getTimeList();
  },
  methods: {
    getTimeList() {
      let path = this.$path.excavate.division_time;
      let params = {};
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.timeList = [];
          // 对时间字符串排序
          let timeArr = res.result.data.sort(function (a, b) {
            return Date.parse(a) - Date.parse(b);
          });
          this.min = Number(timeArr[0].split(" ")[1].split(":")[0]);
          this.max = Number(
            timeArr[timeArr.length - 1].split(" ")[1].split(":")[0]
          );
          this.sliderValue = Number(timeArr[0].split(" ")[1].split(":")[0]);
          for (let i = 0; i < timeArr.length; i++) {
            let marks = timeArr[i].split(" ")[1].split(":")[0];
            this.$set(this.marks, Number(marks), timeArr[i].split(" ")[1]);
            let temp = {
              label: timeArr[i],
              value: timeArr[i],
            };
            this.timeList.push(temp);
          }
          console.log(this.marks);
          this.timeValue = this.timeList[0].value;
          this.getCityList();
        }
      });
    },
    getCityList() {
      let path = this.$path.excavate.division_area;
      let params = {
        dataset: this.timeValue,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.cityList = [];
          for (let i = 0; i < res.result.data.length; i++) {
            let temp = {
              label: res.result.data[i],
              value: res.result.data[i],
            };
            this.cityList.push(temp);
          }
        }
      });
    },
    getData(item, index) {
      this.cityValue = item.value;
      this.cityIndex = index;
      this.timeValue = this.timeList[this.num].value;
      let path = this.$path.excavate.division_flow;
      let params = {
        dataset: this.timeValue,
        personType: this.cityValue,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.removeMapLayer();
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
          if (this.interval_type) {
            this.startInterval();
          }
          if (this.num == this.timeList.length - 1) {
            this.num = 0;
          } else {
            this.num++;
          }
          this.interval_type = false;
        }
      });
    },
    removeMapLayer() {
      if (this.$map.heatmapLayer) {
        this.$map.removeLayer(this.$map.heatmapLayer);
        this.$map.heatmapLayer = null;
      } else {
        this.$map.removeLayer(this.$map.polylineLayers);
        this.$map.polylineLayers = [];
      }
    },
    startInterval() {
      let max = this.max;
      let min = this.min;
      this.interval = window.setInterval(() => {
        this.getData({ value: this.cityValue }, this.cityIndex);
        if (this.sliderValue >= max) {
          this.sliderValue = min;
        } else {
          this.sliderValue++;
        }
      }, 2000);
    },
  },
};
</script>

<style scoped>
#flowScatter {
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 10px;
  display: flex;
  align-items: center;
  z-index: 1;
  background-color: #f0f2f5;
}
.item {
  margin-left: 20px;
}
.select {
  color: #46d1ff;
}
.jdt {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background-color: #f0f2f5;
  height: 50px;
  padding: 0 100px;
}
.legend_box {
  position: fixed;
  right: 20px;
  bottom: 70px;
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