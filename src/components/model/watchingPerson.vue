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
        @change="getDataList"
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
        <h3 style="margin-bottom: 10px">人群种类：</h3>
        <ul>
          <li
            v-for="(item, index) in dataList"
            :key="index"
            @click="getDataPath(item, index)"
            :class="dataIndex == index ? 'select' : ''"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
      <div v-else style="text-align: center">
        <h2 style="font-size: 24px; padding-bottom: 30px">
          该数据集共300条出行轨迹
        </h2>
        <el-button type="primary" @click="start">开始辨识</el-button>
      </div>
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
      dataIndex: 0,
      dataList: [],
    };
  },
  mounted() {
    this.getDataset();
    let memory = localStorage.getItem("memory_person");
    if (memory) {
      this.datasetValue = JSON.parse(memory).dataset;
      this.getDataList();
      this.getDataPath(JSON.parse(memory), JSON.parse(memory).index);
      this.memory_type = true;
    }
  },
  methods: {
    start() {
      this.datasetValue = "1";
      this.getDataList();
      setTimeout(() => {
        this.getDataPath(this.dataList[0], 0);
      }, 500);
      this.memory_type = true;
    },
    getDataset() {
      let path = this.$path.travel.person_type_dataset;
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
        }
      });
    },
    getDataList() {
      let path = this.$path.travel.person_type_count;
      let params = {
        dataset: this.datasetValue,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.dataList = [];
          for (let i = 0; i < res.result.data.length; i++) {
            let temp = {
              label: `${res.result.data[i].person_type} (${res.result.data[i].count})`,
              value: res.result.data[i].person_type,
            };
            this.dataList.push(temp);
          }
        }
      });
    },
    getDataPath(item, index) {
      this.dataIndex = index;
      let path = this.$path.travel.get_track_person;
      let params = {
        dataset: this.datasetValue,
        personType: item.value,
        limitNum: 50,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.removeMapLayer();
          for (let i = 0; i < res.result.data.length; i++) {
            let temp = {
              path: `${res.result.data[i].ori_location};${res.result.data[i].route}${res.result.data[i].des_location}`,
              label: `起点：${res.result.data[i].ori_name}，终点：${res.result.data[i].des_name}，人群类型：${res.result.data[i].person_type}`,
            };
            this.$map.pathSimplifier(temp, "noAnimate");
            // this.$map.addLinelayer(temp.path);
            let memoryData = {
              dataset: this.datasetValue,
              value: item.value,
              limitNum: 50,
              index: index,
            };
            localStorage.setItem("memory_person", JSON.stringify(memoryData));
          }
        }
      });
    },
    removeMapLayer() {
      if (this.$map.polylineLayers) {
        this.$map.removeLayer(this.$map.polylineLayers);
        this.$map.polylineLayers = [];
      } else {
        var arr = this.$map.map.getLayers();
        if (arr.length > 5) {
          for (let i = 0; i < 50; i++) {
            arr.pop();
            this.$map.map.setLayers(arr);
          }
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
</style>