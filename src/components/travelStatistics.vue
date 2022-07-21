<template>
  <div
    id="travelStatistics"
    ref="box"
    @mousedown.stop="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)"
  >
    <header>
      <span>观赛出行模式辨识</span>
      <i class="el-icon-close" @click="close"></i>
    </header>
    <ul class="content">
      <li>
        <span>数据集：</span>
        <el-select
          v-model="datasetValue"
          placeholder="请选择"
          style="width: 200px"
          size="mini"
          @change="getPersonList"
        >
          <el-option
            v-for="item in datasetList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </li>
      <li>
        <span style="margin-right: 10px">人 群：</span>
        <el-select
          v-model="personValue"
          placeholder="请选择"
          style="width: 200px"
          size="mini"
        >
          <el-option
            v-for="item in personList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </li>
      <li>
        <span style="margin-right: 10px">数 量：</span>
        <el-input
          v-model="limitNum"
          placeholder="请输入内容"
          style="width: 200px"
          size="mini"
          id="travelInput"
        ></el-input>
      </li>
    </ul>
    <footer>
      <el-button type="primary" @click="getTrackPerson" size="mini"
        >确定</el-button
      >
      <el-button type="danger" @click="close" size="mini">取消</el-button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datasetValue: "",
      datasetList: [],
      personValue: "",
      personList: [],
      limitNum: 5,
      mapLayer_length: 5,
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
    };
  },
  mounted() {
    this.getDataset();
  },
  methods: {
    getDataset() {
      let path = this.$path.travel.travel_mode_dataset;
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
    getPersonList() {
      console.log(123);
      let path = this.$path.travel.travel_mode_count;
      let params = {
        dataset: this.datasetValue,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.personList = [];
          for (let i = 0; i < res.result.data.length; i++) {
            let temp = {
              label: `${res.result.data[i].travel_mode} (${res.result.data[i].count})`,
              value: res.result.data[i].travel_mode,
            };
            this.personList.push(temp);
          }
        }
      });
    },
    getTrackPerson() {
      let path = this.$path.travel.get_track_travel;
      let params = {
        dataset: this.datasetValue,
        travelMode: this.personValue,
        limitNum: this.limitNum,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.removeMapLayer();
          for (let i = 0; i < res.result.data.length; i++) {
            let temp = {
              path: `${res.result.data[i].ori_location};${res.result.data[i].route}${res.result.data[i].des_location}`,
              label: `起点：${res.result.data[i].ori_name}，终点：${res.result.data[i].des_name}`,
            };
            // this.$map.pathSimplifier(temp, "noAnimate");
            this.$map.addLinelayer(temp.path);
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
          for (let i = 0; i < this.mapLayer_length; i++) {
            arr.pop();
            this.$map.map.setLayers(arr);
          }
        }
        this.mapLayer_length = this.limitNum;
      }
    },
    close() {
      this.$store.state.travelStatistics_show = false;
      this.removeMapLayer();
    },
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      if (event.target.id == "travelInput") {
        return;
      }
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
      let moveLeft = event.pageX - this.moveDataelse.x + 200 + "px";
      let moveTop = event.pageY - this.moveDataelse.y + "px";
      this.$refs.box.style.left = moveLeft;
      this.$refs.box.style.top = moveTop;
      event.currentTarget.style.cursor = "move";
    },
    mouseUpHandleelse(event) {
      window.onmousemove = null;
      event.currentTarget.style.cursor = "default";
    },
    // 移动弹窗方法 END
  },
};
</script>

<style scoped>
#travelStatistics {
  width: 400px;
  /* height: 200px; */
  background-color: #fffe;
  border: 1px solid #ccc;
  border-radius: 5px;
}
header {
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
header span {
  font-size: 16px;
  font-weight: bold;
}
header i {
  cursor: pointer;
}
.content {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 150px;
}
footer {
  padding: 10px;
  display: flex;
  justify-content: center;
}
</style>