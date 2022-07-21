<template>
  <div
    id="personnelFlow"
    ref="box"
    @mousedown.stop="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)"
  >
    <header>
      <span>交通需求层次辨识</span>
      <i class="el-icon-close" @click="close"></i>
    </header>
    <ul class="content">
      <li>
        <span>交通需求层次：</span>
        <el-select
          v-model="levelvalue"
          placeholder="请选择"
          style="width: 200px"
          size="mini"
          @change="getPath"
        >
          <el-option
            v-for="item in levelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </li>
      <li>
        <span>数据集：</span>
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
      </li>
      <li>
        <span>时间：</span>
        <el-select
          v-model="timeValue"
          placeholder="请选择"
          style="width: 200px"
          size="mini"
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
        <span>数量：</span>
        <el-input
          v-model="limitNum"
          placeholder="请输入内容"
          style="width: 200px"
          size="mini"
          id="personInput"
        ></el-input>
      </li>
    </ul>
    <footer>
      <el-button type="primary" @click="getDemandPath" size="mini"
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
      levelvalue: "",
      levelList: [
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
      datasetValue: "",
      datasetList: [],
      timeValue: "",
      timeList: [],
      limitNum: 5,
      mapLayer_length: 5,
      timePath: "",
      demandPath: "",
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
    };
  },
  mounted() {
    // this.getDataset();
  },
  methods: {
    getPath() {
      if (this.levelvalue == "od") {
        this.timePath = this.$path.traffic.od_time;
        this.demandPath = this.$path.traffic.od_demand;
      } else if (this.levelvalue == "path") {
        this.timePath = this.$path.traffic.path_time;
        this.demandPath = this.$path.traffic.path_demand;
      } else {
        this.timePath = this.$path.traffic.link_time;
        this.demandPath = this.$path.traffic.link_demand;
      }
      this.getDataset();
    },
    getDataset() {
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
        }
      });
    },
    getDemandPath() {
      let path = this.demandPath;
      let params = {
        dataset: this.datasetValue,
        personType: this.timeValue,
        limitNum: this.limitNum,
      };
      this.$http.get(path, params).then((res) => {
        if (res.result.code == 1) {
          this.removeMapLayer()
          if (this.levelvalue == "od") {
            for (let i = 0; i < res.result.data.length; i++) {
              let temp = {
                path: `${res.result.data[i].ori_location};${res.result.data[i].des_location}`,
                label:`起点：${res.result.data[i].ori_name}，终点：${res.result.data[i].des_name}`,
              };
              this.$map.pathSimplifier(temp,"header");
            }
          }else{
            for (let i = 0; i < res.result.data.length; i++) {
              let temp = {
                path: `${res.result.data[i][this.levelvalue]}`,
                label:``,
              };
              this.$map.pathSimplifier(temp);
            }
          }
        }
      });
    },
    removeMapLayer() {
      var arr = this.$map.map.getLayers();
      if (arr.length > 5) {
        for (let i = 0; i < this.mapLayer_length; i++) {
          arr.pop();
          this.$map.map.setLayers(arr);
        }
      }
      this.mapLayer_length = this.limitNum
      console.log()
    },
    close() {
      this.$store.state.level_show = false;
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
  align-items: flex-end;
  justify-content: space-evenly;
  height: 150px;
  width: 340px;
}

footer {
  padding: 10px;
  display: flex;
  justify-content: center;
}
</style>