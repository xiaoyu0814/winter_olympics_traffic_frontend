<template>
  <div
    id="personnelFlow"
    ref="box"
    @mousedown.stop="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)"
  >
    <header>
      <span>多场景瓶颈挖掘</span>
      <i class="el-icon-close" @click="close"></i>
    </header>
    <ul class="content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="赛区流量" name="first">
          <li style="margin-bottom: 10px">
            <span>数时间：</span>
            <el-select
              v-model="timeValue"
              placeholder="请选择"
              style="width: 200px"
              size="mini"
              @change="getCityList"
            >
              <el-option
                v-for="item in timeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li>
            <span style="margin-right: 10px">城市：</span>
            <el-select
              v-model="cityValue"
              placeholder="请选择"
              style="width: 200px"
              size="mini"
            >
              <el-option
                v-for="item in cityList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li v-if="false">
            <span style="margin-right: 10px">数 量：</span>
            <el-input
              v-model="limitNum"
              placeholder="请输入内容"
              style="width: 200px"
              size="mini"
              id="personInput"
            ></el-input>
          </li>
        </el-tab-pane>
        <el-tab-pane label="火车站流量" name="second"></el-tab-pane>
        <el-tab-pane label="航班起落点" name="third"></el-tab-pane>
      </el-tabs>
    </ul>
    <footer>
      <el-button type="primary" @click="getData" size="mini">确定</el-button>
      <el-button type="danger" @click="close" size="mini">取消</el-button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeValue: "",
      timeList: [],
      cityValue: "",
      cityList: [],
      limitNum: 5,
      mapLayer_length: 5,
      activeName: "first",
      getDataUrl: this.$path.excavate.division_flow,
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
    handleClick(tabs) {
      console.log(this.activeName);
      if (this.activeName == "first") {
        this.getDataUrl = this.$path.excavate.division_flow;
      } else if (this.activeName == "second") {
        this.getDataUrl = this.$path.excavate.hsr_demand;
      } else {
        this.getDataUrl = this.$path.excavate.airport_demand;
      }
    },
    getDataset() {
      let path = this.$path.excavate.division_time;
      let params = {};
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
    getData() {
      let path = this.getDataUrl;
      let params = {
        dataset: this.timeValue,
        personType: this.cityValue,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.removeMapLayer();
          if (this.activeName == "third") {
            for (let i = 0; i < res.result.data.length; i++) {
              let temp = {
                path: `${res.result.data[i].start_location};${res.result.data[i].end_location}`,
                label:`起点：${res.result.data[i].start_name}，终点：${res.result.data[i].end_name}`,
              };
              // this.$map.pathSimplifier(temp,"noAnimate");
              this.$map.addLinelayer(temp.path)
            }
          } else {
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
        }
      });
    },

    removeMapLayer() {
      if (this.$map.heatmapLayer) {
        this.$map.removeLayer(this.$map.heatmapLayer);
        this.$map.heatmapLayer = null;
      }else{
        this.$map.removeLayer(this.$map.polylineLayers);
        this.$map.polylineLayers = [];
      }
    },
    close() {
      this.$store.state.excavate_show = false;
      this.removeMapLayer();
    },
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      if (event.target.id == "personInput") {
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
#personnelFlow {
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