<template>
  <div id="watchingPerson">
    <mapBox />
    <header class="position">
      <i class="el-icon-coin"></i>
      <span>选择数据集：</span>
      <el-select
        v-model="datasetValue"
        placeholder="请选择"
        style="width: 200px"
        size="mini"
        @change="getTimeList"
      >
        <el-option
          v-for="item in datasetList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </header>
    <div class="position leftBox">
      <div v-if="memory_type">
        <h3 style="margin-bottom: 10px">交通需求层次：</h3>
        <ul>
          <li
            v-for="(item, index) in dataList"
            :key="index"
            @click="getDataset(item, index)"
            :class="dataIndex == index ? 'select' : ''"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
      <div v-else style="text-align: center">
        <el-button type="primary" @click="start">交通需求层次展示</el-button>
      </div>
    </div>
    <div class="legend_box">
      <!-- <span>路网流量</span> -->
      <img src="/assets/img/legend_1.png" alt="" />
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
      memory_type: false,
      datasetValue: "",
      datasetList: [],
      dataIndex: -1,
      dataList: [
        {
          label: "od层",
          value: "od",
        },
        {
          label: "path层",
          value: "path",
        },
        {
          label: "link层",
          value: "link",
        },
      ],
      timeValue: "",
      timeList: [],
      levelvalue: "",
      timePath: "",
      demandPath: "",
    };
  },
  mounted() {
    let a = JSON.parse(localStorage.getItem("memory_level"))
    if(a){
      this.getDataset(a, a.index);
      this.memory_type = true;
    }
  },
  methods: {
    start() {
      this.memory_type = true;
    },
    getDataset(item, index) {
      this.dataIndex = index;
      this.levelvalue = item.value;
      if (item.value == "od") {
        this.timePath = this.$path.traffic.od_time;
        this.demandPath = this.$path.traffic.od_demand;
      } else if (item.value == "path") {
        this.timePath = this.$path.traffic.path_time;
        this.demandPath = this.$path.traffic.path_demand;
      } else {
        this.timePath = this.$path.traffic.link_time;
        this.demandPath = this.$path.traffic.link_demand;
      }
      let path = this.$path.traffic.demand_dataset;
      let params = {};
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.datasetList = [];
          for (let i = 0; i < res.result.data.length; i++) {
            let temp = {
              label: res.result.data[i],
              value: res.result.data[i],
            };
            this.datasetList.push(temp);
          }
          this.datasetValue = this.datasetList[0].value;
          this.getTimeList();
        }
      });
    },
    getTimeList() {
      let path = this.timePath;
      let params = {
        dataset: this.datasetValue,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.timeList = [];
          for (let i = 0; i < res.result.data.length; i++) {
            let temp = {
              label: res.result.data[i],
              value: res.result.data[i],
            };
            this.timeList.push(temp);
          }
          this.timeValue = this.timeList[0].value;
          this.getDataPath();
        }
      });
    },
    getDataPath() {
      let path = this.demandPath;
      let params = {
        dataset: this.datasetValue,
        personType: this.timeValue,
        limitNum: 50,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.removeMapLayer();
          if (this.levelvalue == "od") {
            for (let i = 0; i < res.result.data.length; i++) {
              let temp = {
                path: `${res.result.data[i].ori_location};${res.result.data[i].des_location}`,
                label: `起点：${res.result.data[i].ori_name}，终点：${res.result.data[i].des_name}`,
                level: `${res.result.data[i].level}`,
              };
              this.$map.pathSimplifier(temp, "header");
            }
          } else {
            for (let i = 0; i < res.result.data.length; i++) {
              let temp = {
                path: `${res.result.data[i][this.levelvalue]}`,
                label: ``,
                level: `${res.result.data[i].level}`,
              };
              // this.$map.pathSimplifier(temp,"color");
              this.$map.addLinelayer(temp.path, temp.level, "od");
            }
          }
          let memory_level = {
            index:this.dataIndex,
            value:this.levelvalue
          }
          localStorage.setItem("memory_level",JSON.stringify(memory_level))
        }
      });
    },
    removeMapLayer() {
      if (this.$map.polylineLayers != []) {
        this.$map.removeLayer(this.$map.polylineLayers);
        this.$map.polylineLayers = [];
      }
      var arr = this.$map.map.getLayers();
      if (arr.length > 5) {
        for (let i = 0; i < 50; i++) {
          arr.pop();
          this.$map.map.setLayers(arr);
        }
      }
    },
  },
};
</script>

<style scoped>
#watchingPerson {
}
.position {
  position: fixed;
  background-color: #f0f2f5;
}
header {
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 10px;
}
.leftBox {
  top: 60px;
  bottom: 0;
  left: 0;
  width: 250px;
  z-index: 1;
  padding: 10px 30px;
}
.leftBox li {
  padding: 2px 10px;
  cursor: pointer;
}
.select {
  color: #46d1ff;
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