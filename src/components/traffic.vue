<template>
  <div
    id="traffic"
    ref="box"
    @mousedown.stop="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)"
  >
    <header>
      <span>拥挤预测</span>
      <i class="el-icon-close" @click="close"></i>
    </header>
    <ul class="content">
      <li class="header">
        <ul class="changebtn_box">
          <li
            v-for="(item, index) in buttonList"
            :key="index"
            @click="changeType(index)"
            :class="select_index == index ? 'select' : ''"
          >
            {{ item.label }}
          </li>
        </ul>
        <div class="legend_box">
          <span>畅通</span>
          <ul>
            <li
              v-for="(item, index) in legendList"
              :key="index"
              :style="{ 'background-color': item.background }"
            ></li>
          </ul>
          <span>拥挤</span>
        </div>
      </li>
      <li class="realTime_box" v-if="changeType_show">
        <span>更新时间：</span>
        <span>{{ $utils.getdate(new Date()) }}</span>
      </li>
      <li class="realTime_box" v-else>
        <span>预测时间：</span>
        <el-date-picker
          v-model="date"
          type="datetime"
          placeholder="选择日期时间"
          size="mini"
          @change="changeDate"
        >
        </el-date-picker>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      personList: [],
      personValue: "",
      limitNum: "",
      select_index: 0,
      changeType_show: true,
      buttonList: [{ label: "实时" }, { label: "预测" }],
      legendList: [
        {
          background: "#34b000",
        },
        {
          background: "#fecb00",
        },
        {
          background: "#df0100",
        },
        {
          background: "#8e0e0b",
        },
      ],
      date: new Date(),
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
    };
  },
  mounted() {
    this.$map.poi();
  },
  methods: {
    close() {
      this.$store.state.traffic_show = false;
      this.$map.closePlaceSearch();
      this.$map.trafficLayer.hide();
      this.$map.traffic_history.hide();
    },
    changeType(index) {
      this.select_index = index;
      if (index == 0) {
        this.changeType_show = true;
        this.$map.traffic_history.hide();
        this.$map.trafficLayer.show();
      } else {
        this.changeType_show = false;
        this.$map.trafficLayer.hide();
        this.$map.traffic_history.show();
      }
    },
    changeDate() {
      let temp = {
        d: this.date.getDay().toString(),
        h: this.date.getHours().toString(),
      };
      console.log(temp);
      this.$map.addTileLayer_history(temp)
    },
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      if (event.target.id == "tipinput") {
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
#traffic {
  width: 400px;
  height: 200px;
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
  /* justify-content: center; */
  height: 150px;
}
.content li {
  width: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
}
.header > .legend_box {
  display: flex;
  align-items: center;
}
.header > .legend_box span {
  font-size: 14px;
}
.header > .legend_box ul {
  display: flex;
}
.header > .legend_box ul li {
  float: left;
  width: 25px;
  margin: 0 1px;
  height: 6px;
}
.changebtn_box {
  display: flex;
  font-size: 14px;
}
.changebtn_box li {
  padding: 5px 10px;
  border: 1px solid #0f89f5;
  color: #0f89f5;
}
.changebtn_box .select {
  background-color: #0f89f5;
  color: #fff;
}
.realTime_box {
  margin-top: 20px;
}
.realTime_box span {
  font-size: 14px;
}
</style>